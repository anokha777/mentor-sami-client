export default (...args) =>
  args
    .reduce((acc, arg) => {
      if (!arg) {
        return acc;
      }

      if (typeof arg === "object") {
        const processedClass = Object.keys(arg).filter(prop =>
          typeof arg[prop] == "function" ? arg[prop]() : arg[prop]
        );
        return processedClass.length > 0 ? [...acc, ...processedClass] : acc;
      }
      return [...acc, arg];
    }, [])
    .join(" ");
