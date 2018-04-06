import React from 'react'

const AdviceProvider = () => {
    var max = 11;
    var random = Math.floor(Math.random() * (max + 1));
    switch(random) {
        case 0:
            return "Don't be a jerk";
            break;
        case 1:
            return "Don't be a jerk";

            break;
        case 2:
            return "Don't be a jerk";

            break;
        case 3:
            return "Don't be a jerk";

            break;
        case 4:
            return "Don't be a jerk";

            break;
        case 5:
            return "Don't be a jerk";

            break;
        case 6:
            return "Don't be a jerk";

            break;
        case 7:
            return "Don't be a jerk";

            break;
        case 8:
            return "Don't be a jerk";

            break;
        case 9:
            return "Don't be a jerk";

            break;
        case 10:
            return "Don't be a jerk";

            break;
        default:
            return "Don't be a jerk";

    }

};
export default new AdviceProvider;