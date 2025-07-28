#!/bin/bash

# Start mongod in background
mongod --replSet rs0 --bind_ip_all --dbpath /data/db &
MONGO_PID=$!

# Wait for mongod to be ready
echo "⏳ Waiting for MongoDB to be ready..."
until mongosh --host localhost --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 1
done

# Delay for stability
sleep 3

# Initiate replica set
echo "⚙️ Initiating replica set..."
mongosh --host mongodb --eval '
try {
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongodb:27017" }]
  })
} catch (e) {
  print("Replica set may already be initiated: " + e.message)
}
'

sleep 3

echo "🌱 Seeding initial data..."
mongosh --host mongodb --eval '
db = db.getSiblingDB("db"); // switch to your target DB
db.users.insertOne({
  username: "admin",
  name: "admin",
  password: "$2b$10$ze5dpASW92up3Dfq7Xc/aeEhIUPzXgCO7tAgTG1isZn2oSOodIBUq", // @Rats13071997
  createdAt: new Date(),
  updatedAt: new Date(),
});
'

# Keep container alive
wait $MONGO_PID
