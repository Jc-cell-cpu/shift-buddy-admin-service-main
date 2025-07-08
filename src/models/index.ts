import fs from "fs";
import path from "path";

// Explicit imports for direct access
import Carrier from "./carrier.model";
import Client from "./client.model";
import Document from "./document.model";
import Ndis from './ndis.model';
import Role from "./role.model";
import Slot from "./slot.model";
import SlotMode from './slotmode.model';
import User from "./user.model";
import Weekday from './weekday.model';
import { XeroToken } from "./xero-token.model";

// Dynamically require all models in the folder
const modelsPath = __dirname;
const models: { [key: string]: any } = {};

// Optional: dynamically load other models (if you add more in the future)
fs.readdirSync(modelsPath)
  .filter(file => file.endsWith(".ts") && file !== "index.ts")
  .forEach(file => {
    const model = require(path.join(modelsPath, file));
    const modelName = path.basename(file, ".ts");
    models[modelName] = model.default || model;
  });

export {
  Carrier, Client, Document, Ndis, Role, Slot,
  SlotMode, User, Weekday, XeroToken
};

export default {
  XeroToken,
  User,
  Role,
  Carrier,
  Document,
  Client,
  Slot,
  SlotMode,
  ...models, // include dynamically loaded models if any
};
