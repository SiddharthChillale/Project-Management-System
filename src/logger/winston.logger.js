import winston from "winston";

const wlogger = winston.createLogger({
    level: "debug",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});
export default wlogger;

// import winston from "winston";
// import path from "path";

// // Helper function to extract file and function information from the stack trace
// const getCallerInfo = () => {
//     const originalFunc = Error.prepareStackTrace;

//     // Temporarily change the prepareStackTrace function to capture file info
//     Error.prepareStackTrace = (_, stack) => stack;

//     const err = new Error();
//     const currentFile = err.stack[1].getFileName(); // The file where logger is called
//     const callerFile = err.stack[2].getFileName(); // The file where function was called
//     const lineNumber = err.stack[2].getLineNumber(); // Line number where the log is called
//     const functionName = err.stack[2].getFunctionName() || "anonymous function";

//     Error.prepareStackTrace = originalFunc;

//     return {
//         fileName: path.basename(callerFile),
//         lineNumber,
//         functionName
//     };
// };

// // Custom log format to include file and function information
// const customFormat = winston.format.printf(({ level, message, timestamp }) => {
//     const { fileName, lineNumber, functionName } = getCallerInfo();
//     return `${timestamp} [${level.toUpperCase()}] (${fileName}:${lineNumber} - ${functionName}) : ${message}`;
// });

// // Create Winston logger instance
// const wlogger = winston.createLogger({
//     level: "info",
//     format: winston.format.combine(
//         winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//         customFormat
//     ),
//     transports: [
//         new winston.transports.Console({
//             format: winston.format.combine(
//                 winston.format.colorize(),
//                 winston.format.simple()
//             )
//         })
//         // You can add more transports here (e.g., file transport)
//     ]
// });
