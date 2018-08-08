export const removeSName = names => {
    return names.filter(name => name.toLowerCase().charAt(0) != 's');
};

// export const removeMName = names => {
//     let newNames = names;
//     names.forEach(name => {
//         if(name.charAt(0) == 'M') {
//             const index = newNames.indexOf(name);
//             newNames.splice(index, 1);
//         };
//     });
//     return newNames;
// };