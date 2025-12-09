/**
 * Route aggregator
 * Combines all routes into a single router
 */

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import organizationRoutes from './organization.routes.js';
import projectRoutes from './project.routes.js';
import csatRoutes from './csat.routes.js';
import integrationRoutes from './integration.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/', projectRoutes); // Nested under /organizations/:orgId/projects
router.use('/', csatRoutes); // Nested under /organizations/:orgId/projects/:projectId/...
router.use('/', integrationRoutes); // Nested and webhook routes

export default router;
