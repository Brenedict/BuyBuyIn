// ==============================================================
/** Author: John Benedict Binas
 * Co-Authors: [Name]
 *
 * Description: This files defines all routes related to the account creation workflow.
 * (1) It includes SUPER ADMIN routes for creating new BUSINESS entities, and adding new SUBSCRIBER accounts (HQ ADMIN)
 * (2) It includes HQ ADMIN routes for creating new BRANCH entities, and adding new MANAGER accounts (BRANCH MANAGER)
 * (3) It includes BRANCH MANAGER routes for creating new CASHIER accounts.
 *
 * Note: All routes are protected and require authentication. The access level required for each route is defined in the controller.
 */
// ==============================================================

// General Imports
import express from "express";

// Controllers
import controller from "../controllers/registration.controller";

const router = express.Router();

// --------------------- SUPER ADMIN GET Routes --------------------------------
router.get("/businesses", controller.businessesGet);
router.get("/subscribers", controller.subscribersGet);

// --------------------- GET Routes for Account Assignment --------------------------------
router.get("/branches", controller.branchesGet);
router.get("/managers", controller.managersGet);
router.get("/cashiers", controller.cashiersGet);

// --------------------- SUPER ADMIN Routes --------------------------------
router.post("/business-entity", controller.businessEntityPost);
router.post("/subscriber-account", controller.subscriberAccountPost);

// --------------------- HQ ADMIN Routes --------------------------------
router.post("/branch-entity", controller.branchEntityPost);
router.post("/manager-account", controller.managerAccountPost);

// --------------------- BRANCH MANAGER Routes --------------------------------
router.post("/cashier-account", controller.cashierAccountPost);

// --------------------- Email Verification for all Roles --------------------------------
router.get("/verify-email", controller.verifyEmailRegistrationToken);
router.post("/complete-account", controller.completeAccountRegistration);

// --------------------- SINGLE GET / EDIT / DELETE (Business) ----------------------------
router.get("/businesses/:businessId", controller.businessSingleGet);
router.patch("/businesses/:businessId", controller.businessPatch);
router.delete("/businesses/:businessId", controller.businessDelete);

// --------------------- SINGLE GET / EDIT / DELETE (Branch) ------------------------------
router.get("/branches/:branchId", controller.branchSingleGet);
router.patch("/branches/:branchId", controller.branchPatch);
router.delete("/branches/:branchId", controller.branchDelete);

// --------------------- SINGLE GET / EDIT / DELETE (Subscriber / Manager / Cashier) ------
router.get("/subscribers/:userId", controller.subscriberSingleGet);
router.get("/subscribers/:userId/delete-context", controller.subscriberDeleteContextGet);
router.patch("/subscribers/:userId", controller.subscriberPatch);
router.delete("/subscribers/:userId", controller.subscriberDelete);

router.get("/managers/:userId", controller.managerSingleGet);
router.get("/managers/:userId/delete-context", controller.managerDeleteContextGet);
router.patch("/managers/:userId", controller.managerPatch);
router.delete("/managers/:userId", controller.managerDelete);

router.get("/cashiers/:userId", controller.cashierSingleGet);
router.patch("/cashiers/:userId", controller.cashierPatch);
router.delete("/cashiers/:userId", controller.cashierDelete);

// --------------------- ACCOUNT STATUS MANAGE (deactivate / reactivate) ------------------
router.patch("/account/:userId/status", controller.accountStatusPatch);

export default router;
