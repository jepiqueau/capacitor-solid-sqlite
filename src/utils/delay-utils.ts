
export const delay = async (delay: number, message: string): Promise<void> => {
        return new Promise (resolve => {
          setTimeout(() => {
            const s = "*".repeat(message.length)
            console.log(`*****************${s}`);
            console.log(`Simulate a delay ${message}`);
            console.log(`*****************${s}`);
            resolve();
          }, delay * 1000);
        });
      }
