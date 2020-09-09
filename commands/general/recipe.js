import axios from 'axios'
//import { chunkString } from '../../libs/utils/chunk-string.js'

const APIKey = process.env.SPOONTACULAR_API_KEY

export default {
  name: 'recipe',
  description:
    'random recipe using the provided tags. The tags (can be diets, meal types, cuisines, or intolerances) that the recipe must have.',
  usage: '[argument] [argument(optional)]',
  async execute(message, args) {
    if (!args[0]) return message.reply('please add an argument after the command.')
    if (args[2]) return message.reply('please input a maximum of two arguments')
    const tags = args.filter((element) => element !== null)
    console.log(tags.toString())
    axios({
      method: 'GET',
      url: 'https://api.spoonacular.com/recipes/random',
      headers: {
        'content-type': 'application/octet-stream',
        useQueryString: true,
      },
      params: {
        number: '1',
        apiKey: APIKey,
        tags: tags.toString(),
      },
    })
      .then((response) => {
        const recipe = response.data.recipes[0]
        const url = recipe.sourceUrl
        const image = recipe.image
        const ingredients = recipe.extendedIngredients
        const title = recipe.title
        const servings = recipe.servings

        const fields = []

        if (ingredients) {
          const ingredientStringArray = ingredients.map((ingredient) => {
            const name = ingredient.originalString
            return `${name}`
          })

          fields.push({
            name: `Ingredients [${servings} serving(s)]`,
            value: ingredientStringArray.join('\n'),
          })
        }

        const embedObject = {
          color: Math.floor(Math.random() * 16777215),
          title,
          fields,
          thumbnail: {
            url: image,
          },
          url,
        }

        message.channel.send({ embed: embedObject })
      })
      .catch((error) => {
        console.log(error)
        message.reply('no recipes found matching your tags')
      })
  },
}
