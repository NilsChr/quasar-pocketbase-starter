export default function generateId() {
    const tokens = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    let id = "";
    for(let i = 0;i < 15;i++) {
        const index = Math.floor(Math.random() * tokens.length);
        id += tokens[index];
    }

    return id;
}