import React from 'react'

export function AdviceProvider () {
    var max = 11;
    var random = Math.floor(Math.random() * (max + 1));
    switch(random) {
        case 0:
            return "\"Sometimes the most productive thing you can do is relax.\" -Mark Black";
            break;
        case 1:
            return "\"The time to relax is when you don't have time for it.\" -Jim Goodwin";

            break;
        case 2:
            return "\"The mind should be allowed some relaxation, that it may return to its work all the better for the rest.\" -Seneca";

            break;
        case 3:
            return "\"Relaxation means releasing all concern and tension and letting the natural order of life flow through one's being.\" -Donald Curtis";

            break;
        case 4:
            return "\"Your mind will answer most questions if you learn to relax and wait for the answer.\" -William S. Burroughs";

            break;
        case 5:
            return "\"Learn to relax. Your body is precious, as it houses your mind and spirit. Inner peace begins with a relaxed body.\" -Norman Vincent Peale";

            break;
        case 6:
            return "\"Put duties aside at least an hour before bed and perform soothing, quiet activities that will help you relax.\" -Dianne Hales";

            break;
        case 7:
            return "\"No matter how much pressure you feel at work, if you could find ways to relax for at least five minutes every hour, you'd be more productive.\" -Dr. Joyce Brothers";

            break;
        case 8:
            return "\"Tension is who you think you should be. Relaxation is who you are.\" -Ancient Chinese Proverb";

            break;
        case 9:
            return "\"It is necessary to relax your muscles when you can. Relaxing your brain is fatal.\" -Stirling Moss";

            break;
        case 10:
            return "\"Taking time out each day to relax and renew is essential to living well.\" -Judith Hanson Lasater";

            break;
        default:
            return "\"To help have less stress, take time to relax.\" -Catherine Pulsifer";

    }

};