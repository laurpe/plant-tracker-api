import { faker } from "@faker-js/faker";

const createPlants = (number) => {
    const arr = [];
    for (i = 0; i <= number; i++) {
        arr.push({
            id: faker.datatype.uuid(),
            name: faker.animal.insect(),
            soil: faker.animal.snake(),
            lastWatered: faker.date.recent(),
            wateringCycle: faker.random.number({ min: 1, max: 30 }),
        });
    }
    return arr;
};

export default createPlants;
