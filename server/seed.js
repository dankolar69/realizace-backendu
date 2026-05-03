const topicDao = require("./dao/topic-dao");

const defaultTopics = [
  { name: "Programming" },
  { name: "Design" },
  { name: "Productivity" },
  { name: "Study Tips" },
  { name: "Career" },
];

console.log("Seeding default topics...");

defaultTopics.forEach((t) => {
  try {
    const existing = topicDao.list().find((x) => x.name === t.name);
    if (existing) {
      console.log(`  - "${t.name}" already exists, skipping`);
      return;
    }
    const created = topicDao.create(t);
    console.log(`  + created "${created.name}" (id: ${created.id})`);
  } catch (e) {
    console.error(`  ! failed for "${t.name}":`, e.message || e);
  }
});

console.log("Done.");
