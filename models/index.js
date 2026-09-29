import Site from "./site.js";
import Equipment from "./equipment.js";
import EquipmentPassport from "./equipmentPassport.js";
import Technician from "./technician.js";
import MaintenanceRequest from "./maintenanceRequest.js";
import RequestStatusHistory from "./requestStatusHistory.js";
import RequestAssignee from "./requestAssignee.js";

Site.hasMany(Equipment, {
  foreignKey: "siteId",
  as: "equipment"
});

Equipment.belongsTo(Site, {
  foreignKey: "siteId",
  as: "site"
});

Equipment.hasOne(EquipmentPassport, {
  foreignKey: "equipmentId",
  as: "passport"
});

EquipmentPassport.belongsTo(Equipment, {
  foreignKey: "equipmentId",
  as: "equipment"
});

Equipment.hasMany(MaintenanceRequest, {
  foreignKey: "equipmentId",
  as: "requests"
});

MaintenanceRequest.belongsTo(Equipment, {
  foreignKey: "equipmentId",
  as: "equipment"
});

MaintenanceRequest.hasMany(RequestStatusHistory, {
  foreignKey: "requestId",
  as: "statusHistory"
});

RequestStatusHistory.belongsTo(MaintenanceRequest, {
  foreignKey: "requestId",
  as: "request"
});

MaintenanceRequest.belongsToMany(Technician, {
  through: RequestAssignee,
  foreignKey: "requestId",
  otherKey: "technicianId",
  as: "assignees"
});

Technician.belongsToMany(MaintenanceRequest, {
  through: RequestAssignee,
  foreignKey: "technicianId",
  otherKey: "requestId",
  as: "requests"
});

RequestAssignee.belongsTo(MaintenanceRequest, {
  foreignKey: "requestId",
  as: "request"
});

RequestAssignee.belongsTo(Technician, {
  foreignKey: "technicianId",
  as: "technician"
});

MaintenanceRequest.hasMany(RequestAssignee, {
  foreignKey: "requestId",
  as: "assignments"
});

Technician.hasMany(RequestAssignee, {
  foreignKey: "technicianId",
  as: "assignments"
});

export {
  Site,
  Equipment,
  EquipmentPassport,
  Technician,
  MaintenanceRequest,
  RequestStatusHistory,
  RequestAssignee
};