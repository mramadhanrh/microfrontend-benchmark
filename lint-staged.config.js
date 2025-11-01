module.exports = {
  '*': filesArray => {
    const files = filesArray.join();
    return [
      `nx reset`,
      `nx affected:lint --fix --files=${files} --skip-nx-cache`,
      `nx format:write --files=${files}`,
    ];
  },
};
