if (typeof String.prototype.replaceAll == "undefined") {
    String.prototype.replaceAll = function (match, replace: any) {
        return this.replace(new RegExp(match, 'g'), () => replace);
    }
}

type TFields = {
    name: string,
    value: string
}

const emailBuilder = (template: string, fields: TFields[] = []) => {
    for (let { name, value } of fields) {
        template = template.replaceAll(`${name.toUpperCase()}`, value)

    }
    return template
}

export { emailBuilder }