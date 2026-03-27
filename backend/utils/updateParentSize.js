import Directory from "../models/directoryModel.js";

export default async function updateParentSize(parentDirId, deltaSize, session) {
    if (!parentDirId) return;
    try {
        while (parentDirId) {
            const currentDir =
                await Directory.findByIdAndUpdate(
                    parentDirId,
                    { $inc: { size: deltaSize } },
                    { session })
                    .select("parentDirId")
                    .lean();

            console.log(currentDir);
            parentDirId = currentDir.parentDirId;
        }
    } catch (error) {
        console.log({ error });
    }
}