import { logAction } from "../utils/audit.util.js";

export const audit = (actionName) => {
  return (req, res, next) => {
    res.on("finish", () => {
      const username = req.user?.username || req.body?.username || "anonymous";
      logAction(req, username, actionName);
    });
    next();
  };
};
