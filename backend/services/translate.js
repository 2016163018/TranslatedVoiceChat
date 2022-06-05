const getTranslate = async (text, sourceLocale, targetLocale) => {
  const key = require("../key.json");
  const request = require("request");

  const options = {
    url: "https://openapi.naver.com/v1/papago/n2mt",
    form: { source: sourceLocale, target: targetLocale, text },
    headers: {
      "X-Naver-Client-Id": key.ClIENT_ID,
      "X-Naver-Client-Secret": key.CLIENT_SECRET,
    },
  };

  const res = await new Promise((resolve) => {
    request.post(options, (_, __, body) => {
      const parsedBody = JSON.parse(body);
      resolve(parsedBody.message.result.translatedText);
    });
  });

  return res;
};

module.exports = { getTranslate };
