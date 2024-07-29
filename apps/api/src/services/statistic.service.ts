import { StatisticModel } from "../schemas/statistic.schema";

export const getUserByName = async (name) => {
    try {
        const user = await StatisticModel.findOne({ name });
        return user;
    } catch (err) {
        console.error(err);
        throw err; // Hatanın üst katmana iletilmesini sağlar
    }
};

export const  getUserInStatistic = async () => {
 return StatisticModel.find().then(users => {
    
    return users;
 }).catch(err => console.log('ERROR getUserInStatistic',err));
} 