module.exports.entry = (req, res) => {
    function entry(table, type, newValue, oldValue) {
        //fetch user using passport
        var changelog = new Changelog();
        changelog.newValue = JSON.stringify(newValue);
        changelog.oldValue = JSON.stringify(oldValue);
        changelog.description = `${user.username} modified ${table} - bla bla bla bla`;
    }
};