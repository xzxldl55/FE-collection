/**
 * 校验密码规则：
 * 1. 必须包含大小写字母，数字与特殊字符
 * 2. 长度需在 8～20 位之间
 * 3. 不能包含用户名
 * @param {string} password 密码
 * @param {string} username 用户名
 * @returns {boolean} 返回匹配结果
 * @example validatePassword('qweASD123..', 'root') // true
 * @example validatePassword('qweASD123..', 'SD123') // false
 */
function validatePassword(password, username = '') {
    if (password.include(username)) {
        return false;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~·!@#$%^&*()_+`\[\]\\|{};:'",<.>/?【】、｜～！？《》；：‘’“”])[A-Za-z\d~!·@#$%^&*()_+`\[\]\\|{};:'",<.>/?【】、｜～！？《》；：‘’“”]{8,20}$/
    return passwordPattern.test(password)
}