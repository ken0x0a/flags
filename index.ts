import sharp from 'sharp'
import { readdirSync, existsSync, mkdir } from 'fs'
import { join } from 'path'

export function ls(dirname: string): string[] {
  return readdirSync(dirname)
}

// function map(array: any[], cb): Promise<any> {
//   Promise.all(
//     array.map((elem) => {
//       return cb(elem)
//     }),
//   )
// }

// const inputDir = 'svg'
const inputDir = 'png/512'

const outputDir = 'dest'

const sizes = [
  {
    name: 'large',
    max: 128,
  },
  {
    name: 'medium',
    max: 64,
  },
  {
    name: 'small',
    max: 32,
  },
]

// https://github.com/lovell/sharp/issues/729#issuecomment-284708688
const baseDensity = 72 / 16
const density =
  baseDensity *
  sizes.map((size) => size.max).reduce((value, currentValue) => {
    return value > currentValue ? value : currentValue
  }, 0)

function mkdirIfNotExist(dir: string) {
  mkdir(dir, (err) => {
    if (err) console.log(err)
    else console.log('mkdir ', dir)
  })
}

if (!existsSync(outputDir)) {
  mkdirIfNotExist(outputDir)
}
sizes.forEach((size) => {
  const dir = join(outputDir, size.name)
  if (!existsSync(dir)) {
    mkdirIfNotExist(dir)
  }
})

ls(inputDir).forEach((filename) => {
  const input = join(inputDir, filename)

  Promise.all(
    sizes.map((size) => {
      const output = join(
        outputDir,
        size.name,
        filename,
        // join(filename.split(/\.(?=\w+$)/)[0], '.png'),
      )

      console.log(output)

      return (
        sharp(
          input,
          // { density }
        )
          .resize(size.max, size.max)
          .max()
          // .png()
          .toFile(output)
      )
    }),
  ).then((v) => {
    console.log('Done!')
  })
})
