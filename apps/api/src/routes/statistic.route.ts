import express from 'express';
import { StatisticModel } from '../schemas/statistic.schema'; // Model importu
const router = express.Router();

router.post('/save', async (req, res) => {
    const users = req.body;

    try {
        for (const userData of users) {
            const { name, food } = userData;

            console.log('Processing user:', name);
            console.log('Food data:', food);

            let user = await StatisticModel.findOne({ name });

            if (user) {
                console.log('Existing user found:', user);

                // Ensure user.food is initialized
                if (!user.food) {
                    user.food = {
                        lahmacun: 0,
                        ayran: 0,
                        tatli: 0,
                        corba: 0,
                        AntepLahmacun: 0,
                        su: 0,
                        Cola: 0,
                        bahsis: 0
                    };
                }

                // Update food quantities
                user.food.lahmacun = (user.food.lahmacun || 0) + (food.lahmacun || 0);
                user.food.ayran = (user.food.ayran || 0) + (food.ayran || 0);
                user.food.tatli = (user.food.tatli || 0) + (food.tatli || 0);
                user.food.corba = (user.food.corba || 0) + (food.corba || 0);
                user.food.AntepLahmacun = (user.food.AntepLahmacun || 0) + (food.AntepLahmacun || 0);
                user.food.su = (user.food.su || 0) + (food.su || 0);
                user.food.Cola = (user.food.Cola || 0) + (food.Cola || 0);
                user.food.bahsis = (user.food.bahsis || 0) + (food.bahsis || 0);

                await user.save();
                console.log('User updated:', user);
            } else {
                user = new StatisticModel({
                    name,
                    food
                });

                await user.save();
                console.log('New user created:', user);
            }
        }

        return res.json({ success: true, msg: 'User data saved successfully!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: 'An error occurred', error: err.message });
    }
});

export default router;