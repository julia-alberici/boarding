import path from "path";
import "dotenv/config";

export default {
    schema: path.join(__dirname, 'prisma/schema.prisma'),
    output: path.join(__dirname, 'src/generated/prisma')
};