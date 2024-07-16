function sin(deg) {
	return Math.round(Math.sin((deg * Math.PI) / 180) * 10000) / 10000;
}
function cos(deg) {
	return Math.round(Math.cos((deg * Math.PI) / 180) * 10000) / 10000;
}
function tan(deg) {
    return Math.round(Math.tan((deg * Math.PI) / 180) * 10000) / 10000;
}

export {
    sin,
    cos,
    tan
}