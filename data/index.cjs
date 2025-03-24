const { faker } = require('@faker-js/faker');

faker.seed(0);
const data = { users: [] };
function createRandomUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email,
    birthDate: faker.date.birthdate(),
    department: faker.commerce.department(),
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
  };
}
module.exports = () => {
  // Create 1000 users
  for (let i = 0; i < 1_000_000; i++) {
    data.users.push(createRandomUser());
  }
  return data;
};
