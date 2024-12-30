export interface Message{
    id: string
    content: string
    timestamp: Date
    sender: {
        id: string
        name: string
        avatar: string
    }
}