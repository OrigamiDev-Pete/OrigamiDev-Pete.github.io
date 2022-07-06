export const deg2rad = (degrees) => {
    return degrees * Math.PI / 180;
}

export const rand_int = (a, b) => {
    return Math.round(Math.random() * (b - a) + a);
}

export const rand_range = (a, b) => {
    return Math.random() * (b - a) + a;
}