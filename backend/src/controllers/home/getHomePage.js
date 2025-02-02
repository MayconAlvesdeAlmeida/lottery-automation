const path = require('path');

module.exports = (req, res) => {
    const filePath = path.join(__dirname, '../../views', 'index.html');
    res.sendFile(filePath);
}