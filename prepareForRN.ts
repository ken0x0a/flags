// StringConstructor
// String.prototype.splice = function(idx, rem, str) {
//   return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
// };

import sharp from 'sharp'
import { readdirSync, existsSync, mkdir } from 'fs'
import { join } from 'path'
import inquirer from 'inquirer'

export function ls(dirname: string): string[] {
  return readdirSync(dirname)
}

// const inputDir = 'svg'
const inputDir = 'png/512'

const outputDir = 'destRN'
// const size = process.argv[2]
async function askSize() {
  const { size } = await inquirer.prompt([
    {
      type: 'input',
      name: 'size',
      message: 'write here!',
      validate: (size: string) => {
        return typeof size === 'number'
      },
      default: 64,
    },
  ])
  return size
}

const getSizes = (size: number) => [
  {
    name: '@1',
    surfix: '',
    max: size,
  },
  {
    name: '@2',
    max: size * 2,
  },
  {
    name: '@3',
    max: size * 3,
  },
  {
    name: '@4',
    max: size * 4,
  },
]

function prepareFilename(
  name: string,
  size: { name: string; surfix?: string },
) {
  const _n = name.split(/\.(?=[^.]+$)/)
  const surfix = typeof size.surfix === 'string' ? size.surfix : size.name

  return `${_n[0]}${surfix}.${_n[1]}`
}
function mkdirIfNotExist(dir: string) {
  mkdir(dir, (err) => {
    if (err) console.log(err)
    else console.log('mkdir ', dir)
  })
}

if (!existsSync(outputDir)) {
  mkdirIfNotExist(outputDir)
}

async function main() {
  if (!existsSync(outputDir)) {
    mkdirIfNotExist(outputDir)
  }
  const size = await askSize()
  const sizes = getSizes(size)

  ls(inputDir).forEach((filename) => {
    const input = join(inputDir, filename)

    Promise.all(
      sizes.map((size) => {
        const output = join(
          outputDir,
          prepareFilename(filename, size),
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
}

main()
