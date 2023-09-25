import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "your-api-key",
});
const openai = new OpenAIApi(configuration);

const getRandomDateTime = (input: string) => {
  const startTimestamp = new Date(input).getTime();
  const endTimestamp = new Date().getTime();
  const randomTimestamp = Math.floor(
    Math.random() * (endTimestamp - startTimestamp) + startTimestamp
  );
  const randomDate = new Date(randomTimestamp);

  const year = randomDate.getUTCFullYear();
  const month = (randomDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = randomDate.getUTCDate().toString().padStart(2, "0");
  const hours = randomDate.getUTCHours().toString().padStart(2, "0");
  const minutes = randomDate.getUTCMinutes().toString().padStart(2, "0");
  const seconds = randomDate.getUTCSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const array = req.body;
  const returnArr = [];
  try {
    for (let i = 0; i < 39; i++) {
      const text = array[i].node.body;
      console.log(array[i].node.created);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You are responding to a post in a Twitter thread about data ownership, identity, and reputation. Make your response
            conversational, indicating that you agree or disagree with the post, or wish to further clarify the post. 
            You care deeply about governance and making sure people's voices are heard. Respond with a short single sentence, no more than 12 words. The post you are replying to is: ${text}.`,
        max_tokens: 50,
        temperature: 0.9,
      });
      console.log(response.data.choices[0].text);
      const toPush = array[i].node;
      const date = getRandomDateTime(array[i].node.created.slice(0, 10));
      toPush.response = response.data.choices[0].text?.replaceAll("\n", "");
      toPush.date = date;
      returnArr.push(toPush);
    }

    res.json(returnArr);
  } catch (err) {
    res.json({
      err,
    });
  }
}
