import express from "express";
import {
  deleteEmployeeDutySchedule,
  getDutySchedules,
  getEmployeeDutySchedule,
  getMyDutySchedule,
  saveEmployeeDutySchedule,
} from "../controllers/dutyScheduleController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleMiddleware("admin"), getDutySchedules);
router.get("/mine", roleMiddleware("teacher", "staff"), getMyDutySchedule);
router.get("/employee/:employeeType/:employeeId", roleMiddleware("admin"), getEmployeeDutySchedule);
router.put("/:employeeType/:employeeId", roleMiddleware("admin"), saveEmployeeDutySchedule);
router.delete("/:employeeType/:employeeId", roleMiddleware("admin"), deleteEmployeeDutySchedule);

export default router;
