const throwError = (res, err) => {
    return res.status(400).json(err);
}
const throwAuthError = (res, err) => {
    return res.status(401).json(err);
}

module.exports = {
    throwError,
    throwAuthError,
}