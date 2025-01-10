"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const secrets_1 = require("./config/secrets");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const userData_routes_1 = __importDefault(require("./routes/userData.routes"));
const stockSearch_routes_1 = __importDefault(require("./routes/stockSearch.routes"));
const cors_1 = __importDefault(require("cors"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cors_1.default)({
            credentials: true,
        }));
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
        yield (0, db_1.connectDB)();
        app.use('/', auth_routes_1.default);
        app.use('/', userData_routes_1.default);
        app.use('/', stockSearch_routes_1.default);
        app.listen(secrets_1.PORT, () => console.log(`Server started on port ${secrets_1.PORT}`));
    });
}
main();
