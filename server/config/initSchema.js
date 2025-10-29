async function initSchema(db) {
    const collections = await db.listCollections().toArray();
    const names = collections.map(col => col.name);

    if(!names.includes('users')) {
        await db.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["firstName", "lastName", "username", "passwordHash", "role"],
                    properties: {
                        firstName: { bsonType: "string" },
                        lastName: { bsonType: "string" },
                        username: { bsonType: "string" },
                        passwordHash: { bsonType: "string" },
                        role: { bsonType: "string", enum: ["admin", "doctor", "patient"] },
                        lastLogin: { bsonType: "timestamp" },
                        lastPasswordChange: { bsonType: "timestamp" }
                    }
                }
            }
        });
        console.log("Created 'users' collection with schema validation");
    }

    if(!names.includes("appointments")) {
        await db.createCollection("appointments", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["date", "startTime", "endTime", "patientId", "doctorId"],
                    properties: {
                        date: { bsonType: "date" },
                        startTime: { bsonType: "string" },
                        endTime: { bsonType: "string" },
                        patientId: { bsonType: "objectId" },
                        doctorId: { bsonType: "objectId" },
                        lastUpdated: { bsonType: "timestamp" }
                    }
                }
            }
        });
        console.log("Created 'appointments' collection with schema validation");
    }
}

module.exports = { initSchema };