import PACKAGE from "../../package.json";

const VERSION = PACKAGE.version;
const NAME = PACKAGE.name;
const VERSION_NAME = `${NAME}@${VERSION}`;

export { NAME, VERSION, VERSION_NAME };
