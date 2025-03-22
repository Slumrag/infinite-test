const { faker } = require('@faker-js/faker');

faker.seed(0);
const data = { users: [] };
function createRandomUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    department: faker.commerce.department(),
    company: faker.company.name(),
    job_title: faker.person.jobTitle(),
  };
}
module.exports = () => {
  // Create 1000 users
  for (let i = 0; i < 1_000_000; i++) {
    data.users.push(createRandomUser());
  }
  return data;
};
