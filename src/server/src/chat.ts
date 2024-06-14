import { Client, Databases,  } from "node-appwrite";
import Config from "./config/config.js";
import ErrorHandler from "./handlers/errorHandler.js";
import logger from "./utils/logger.js";

interface Message {
id: string;
content: string;
sender: string;
}

const { APPWRITE_ENDPOINT, PROJECT_ID,DATABASE_ID, CHAT_COLLECTION_ID } = Config.APPWRITE;

class ChatController {
  private io: any;
  private client: Client;
  private databases: Databases;

  constructor(io: any) {
    this.io = io;
    this.client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(PROJECT_ID);
    this.databases = new Databases(this.client);
  }

  handleConnection(socket:any): void {
    socket.on("join", async ({ roomId }: { roomId: string }) => {
      socket.join(roomId);
      logger.info(`joining ${roomId}`);
      try {
        const messages = await this.getChatHistory(roomId);
        socket.emit("loadMessages", messages);
      } catch (error) {
        logger.error("Error loading messages:", error);
        socket.emit("error", "Failed to load messages");
      }
    });

    socket.on("sendMessage", async ({ roomId, message }: { roomId: string; message: Message }) => {
      try {
        await this.saveMessage(roomId, message);
        logger.info(message);
        // Emitting message only to the specific room
        socket.to(roomId).emit("message", message);
      } catch (error) {
        logger.error("Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("disconnect", () => {
      logger.info("User disconnected");
    });
  }

  async getChatHistory(roomId: string): Promise<any[]> {
    try {
      const result = await this.databases.listDocuments(
        "collections/chat",
        roomId
      );
      return result.documents;
    } catch (error:any) {
      throw new ErrorHandler(
        500,
        "Error retrieving chat history",
        error
      );
    }
  }

  async saveMessage(roomId: string, message: Message): Promise<void> {
    try {
      await this.databases.createDocument(DATABASE_ID, CHAT_COLLECTION_ID, roomId, message);
    } catch (error:any) {
      throw new ErrorHandler(500, "Failed to save message", error);
    }
  }
}

export default ChatController;
