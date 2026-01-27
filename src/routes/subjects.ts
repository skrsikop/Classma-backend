import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import express  from 'express';
import { departments, subjects } from '../db/schema/index.js';
import { db } from '../db/index.js';


const subjectsRouter = express.Router();

// Get all subjects with optional search filtering and paggination
subjectsRouter.get('/', async (req,res) => {
    try {
        const {search , department, page = 1, limit = 10} = req.query;

         const currentPage = Math.max(1, Number(Array.isArray(page) ? page[0] : page) || 1);
         const limitPerPage = Math.max(1, Number(Array.isArray(limit) ? limit[0] : limit) || 10);

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = []
        // if search query exists filter by subject name or subject code
        if(search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            )
        }

        // if department filter exists macth department name
        if(department) {
            filterConditions.push(ilike(departments.name, `%${department}%`))
        }

        // combine all filters using and if any exists
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db.select({ count: sql<number>`count(*)` }).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id)).where(whereClause);

         const totalCount = Number(countResult[0]?.count) || 0;

        const subjectList = await db
            .select({
                ...getTableColumns(subjects),
                department: {...getTableColumns(departments)}
            }).from(subjects)
              .leftJoin(departments, eq(subjects.departmentId, departments.id))
              .where(whereClause)
              .limit(limitPerPage)
              .offset(offset)
              .orderBy(desc(subjects.createdAt))

        res.status(200).json({
            data: subjectList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage)
            }
        });      
    } catch (error) {
        console.error(`Get /subjects error: ${error}`);
        res.status(500).json({ error: 'Failed to get subjects' });
    }
})

export default subjectsRouter