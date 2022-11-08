import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html>
              <Head>
                {/* AlbertSans-Bold */}
                <link
                rel='preload'
                href='/fonts/AlbertSans-Bold.ttf'
                as='font'
                crossOrigin='anonymous' />

                {/* AlbertSans-Regular */}
                <link
                rel='preload'
                href='/fonts/AlbertSans-Regular.ttf'
                as='font'
                crossOrigin='anonymous' />

                {/* AlbertSans-SemiBold */}
                <link
                rel='preload'
                href='/fonts/AlbertSans-SemiBold.ttf'
                as='font'
                crossOrigin='anonymous' />
                
              </Head>
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
    }
}

export default MyDocument;