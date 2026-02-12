
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "lib", "data.json");

export async function getData() {
    try {
        const data = await readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data file:", error);
        return null;
    }
}

export async function updateData(section: string, value: any) {
    try {
        const data = await getData();
        if (!data) return null;

        if (section === "full") {
            // Update everything (if needed, though safer to do section by section)
            await writeFile(DATA_FILE, JSON.stringify(value, null, 2));
            return value;
        }

        data[section] = value;
        await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error("Error updating data file:", error);
        return null;
    }
}
