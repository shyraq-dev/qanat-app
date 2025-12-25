"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MessageCircle, Cloud, Users, User, Send, Upload, X, Edit2, Save, Trash2, Heart, MessageSquare, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
  chatId: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  online: boolean;
}

interface CloudFile {
  id: string;
  name: string;
  size: string;
  uploadDate: Date;
}

interface Post {
  id: string;
  author: string;
  topic: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

interface Profile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
}

export default function QanatInterface() {
  // Clerk authentication
  const { user, isLoaded, isSignedIn } = useUser();
  
  // States
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Мәдениет");
  const [profile, setProfile] = useState<Profile>({
    name: user?.fullName || "Qanat User",
    username: user?.username || user?.firstName || "user",
    bio: "Qanat Premium қолданышысы",
    avatar: user?.firstName?.substring(0, 2).toUpperCase() || "QU"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update profile when user loads
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName || "Qanat User",
        username: user.username || user.firstName || "user",
        bio: "Qanat Premium қолданушысы",
        avatar: user.firstName?.substring(0, 2).toUpperCase() || "QU"
      });
    }
  }, [user]);

  // Load data from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem("qanat_chats");
    const savedMessages = localStorage.getItem("qanat_messages");
    const savedFiles = localStorage.getItem("qanat_files");
    const savedPosts = localStorage.getItem("qanat_posts");
    const savedProfile = localStorage.getItem("qanat_profile");

    if (savedChats) setChats(JSON.parse(savedChats));
    else initializeChats();
    
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedFiles) setCloudFiles(JSON.parse(savedFiles));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    else initializePosts();
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  // Initialize default chats
  const initializeChats = () => {
    const defaultChats: Chat[] = [
      { id: "1", name: "Айгерім", lastMessage: "Сәлем! Кешке кездесеміз бе?", avatar: "АГ", online: true },
      { id: "2", name: "Даурен", lastMessage: "Жоба бойынша не жаңалық?", avatar: "ДР", online: true },
      { id: "3", name: "Жансая", lastMessage: "Рақмет көмегің үшін! 🙏", avatar: "ЖС", online: false },
      { id: "4", name: "Нұрлан", lastMessage: "Ертең семинарға келесің бе?", avatar: "НР", online: true },
      { id: "5", name: "Qanat AI", lastMessage: "Сәлем! Мен сізге қалай көмектесе аламын?", avatar: "🤖", online: true },
      { id: "6", name: "Қазақстан Тобы", lastMessage: "Жаңа идеяларды талқылаймыз!", avatar: "🇰🇿", online: true }
    ];
    setChats(defaultChats);
    localStorage.setItem("qanat_chats", JSON.stringify(defaultChats));
  };

  // Initialize default posts
  const initializePosts = () => {
    const defaultPosts: Post[] = [
      {
        id: "1",
        author: "Айгерім Қ.",
        topic: "Мәдениет",
        content: "Абай Құнанбаевтың 179 жылдығына арналған іс-шара өте керемет өтті! Алматыда болған концерт ерекше әсер қалдырды.",
        likes: 24,
        comments: 8,
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: "2",
        author: "Даурен М.",
        topic: "Технология",
        content: "Қазақстанда жасанды интеллект саласы қарқынды дамып келеді. Біздің де өз AI стартаптарымыз бар екенін білесіздер ме?",
        likes: 45,
        comments: 15,
        timestamp: new Date(Date.now() - 7200000)
      }
    ];
    setPosts(defaultPosts);
    localStorage.setItem("qanat_posts", JSON.stringify(defaultPosts));
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
      chatId: selectedChat.id
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem("qanat_messages", JSON.stringify(updatedMessages));

    // Update last message in chat
    const updatedChats = chats.map(chat =>
      chat.id === selectedChat.id ? { ...chat, lastMessage: newMessage } : chat
    );
    setChats(updatedChats);
    localStorage.setItem("qanat_chats", JSON.stringify(updatedChats));

    setNewMessage("");

    // Simulate response for AI bot
    if (selectedChat.id === "5") {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Сізге көмектесуге дайынмын! Qanat арқылы сіз қауіпсіз байланыса аласыз. 🤖",
          sender: "other",
          timestamp: new Date(),
          chatId: selectedChat.id
        };
        const newMessages = [...updatedMessages, aiResponse];
        setMessages(newMessages);
        localStorage.setItem("qanat_messages", JSON.stringify(newMessages));
      }, 1000);
    }
  };

  // Upload file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: CloudFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      uploadDate: new Date()
    }));

    const updatedFiles = [...cloudFiles, ...newFiles];
    setCloudFiles(updatedFiles);
    localStorage.setItem("qanat_files", JSON.stringify(updatedFiles));
  };

  // Delete file
  const deleteFile = (id: string) => {
    const updatedFiles = cloudFiles.filter(file => file.id !== id);
    setCloudFiles(updatedFiles);
    localStorage.setItem("qanat_files", JSON.stringify(updatedFiles));
  };

  // Create post
  const createPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: profile.name,
      topic: selectedTopic,
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: new Date()
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("qanat_posts", JSON.stringify(updatedPosts));
    setNewPost("");
  };

  // Like post
  const likePost = (id: string) => {
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem("qanat_posts", JSON.stringify(updatedPosts));
  };

  // Save profile
  const saveProfile = () => {
    localStorage.setItem("qanat_profile", JSON.stringify(profile));
    setIsEditingProfile(false);
  };

  // Filter chats
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter messages for selected chat
  const chatMessages = messages.filter(msg => msg.chatId === selectedChat?.id);

  // Filter posts by topic
  const filteredPosts = posts.filter(post => post.topic === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#FDFCFB] to-[#FEF9C3] flex flex-col">
      {/* Header */}
      <header className="p-4 bg-white/80 backdrop-blur-md shadow flex justify-between items-center border-b border-blue-100">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 flex items-center gap-2">
          <MessageCircle className="w-8 h-8 md:w-10 md:h-10" />
          Qanat <span className="text-xs md:text-sm text-yellow-600 font-medium">Байланысқа қанат бітір!</span>
        </h1>
        <div className="flex gap-2 items-center">
          <Input 
            placeholder="Іздеу..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-32 md:w-64 bg-white/60 border border-blue-200" 
          />
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-blue-700">{user.fullName}</p>
                <p className="text-xs text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div>
          )}
        </div>
      </header>

      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 bg-white/90 shadow-inner border-t border-b border-blue-100">
          <TabsTrigger value="chats" className="flex items-center gap-1 md:gap-2 text-blue-700 text-xs md:text-base">
            <MessageCircle size={16}/>
            <span className="hidden md:inline">Чаттар</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-1 md:gap-2 text-blue-700 text-xs md:text-base">
            <Users size={16}/>
            <span className="hidden md:inline">Алаң</span>
          </TabsTrigger>
          <TabsTrigger value="cloud" className="flex items-center gap-1 md:gap-2 text-blue-700 text-xs md:text-base">
            <Cloud size={16}/>
            <span className="hidden md:inline">Бұлт</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-1 md:gap-2 text-blue-700 text-xs md:text-base">
            <User size={16}/>
            <span className="hidden md:inline">Профиль</span>
          </TabsTrigger>
        </TabsList>

        {/* Chats */}
        <TabsContent value="chats" className="p-2 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <Card className="col-span-1 bg-white/90 border-blue-100 max-h-[70vh] overflow-y-auto">
            <CardContent className="p-2 space-y-2">
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3 rounded-xl cursor-pointer border shadow-sm transition ${
                    selectedChat?.id === chat.id
                      ? "bg-gradient-to-r from-blue-200 to-blue-100 border-blue-300"
                      : "bg-gradient-to-r from-blue-100 to-blue-50 border-blue-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold relative">
                      {chat.avatar}
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-blue-800 truncate">{chat.name}</h3>
                      <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 bg-white/95 border-blue-100 flex flex-col">
            <CardContent className="flex flex-col h-[70vh] p-0">
              {selectedChat ? (
                <>
                  <div className="p-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-yellow-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {selectedChat.avatar}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-blue-700">{selectedChat.name}</h2>
                      <p className="text-xs text-gray-500">{selectedChat.online ? "Онлайн" : "Офлайн"}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <AnimatePresence>
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`p-3 rounded-xl max-w-[70%] shadow ${
                              message.sender === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-blue-100 text-gray-800"
                            }`}
                          >
                            {message.text}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex gap-2 p-3 border-t border-blue-100 bg-blue-50/30">
                    <Input
                      placeholder="Хабарлама жазыңыз..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="bg-white/80 border-blue-200"
                    />
                    <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Send size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle size={64} className="mx-auto mb-4 opacity-20" />
                    <p>Чат таңдаңыз</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community */}
        <TabsContent value="community" className="p-2 md:p-6 space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {["Мәдениет", "Ғылым", "Технология", "Әдебиет"].map((topic) => (
              <Button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                variant={selectedTopic === topic ? "default" : "outline"}
                className={selectedTopic === topic ? "bg-yellow-400 text-blue-900" : ""}
              >
                {topic}
              </Button>
            ))}
          </div>

          <Card className="bg-white/90 border-blue-100">
            <CardContent className="p-4">
              <textarea
                placeholder="Жаңа пост жазыңыз..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
              />
              <Button onClick={createPost} className="mt-2 bg-blue-600 hover:bg-blue-700">
                Жариялау
              </Button>
            </CardContent>
          </Card>

          {filteredPosts.map((post) => (
            <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-white/90 border-l-4 border-l-yellow-400 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-blue-700 text-lg">{post.author}</h3>
                      <p className="text-xs text-gray-500">
                        {post.topic} • {new Date(post.timestamp).toLocaleTimeString("kk-KZ", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <button onClick={() => likePost(post.id)} className="flex items-center gap-1 hover:text-red-500 transition">
                      <Heart size={16} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition">
                      <MessageSquare size={16} /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition">
                      <Share2 size={16} /> Бөлісу
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Cloud Storage */}
        <TabsContent value="cloud" className="p-2 md:p-6">
          <div className="mb-4">
            <label className="inline-block">
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
              <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <Upload size={18} className="mr-2" /> Файл жүктеу
              </Button>
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cloudFiles.map((file) => (
              <motion.div
                key={file.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white/90 shadow rounded-xl p-3 border border-blue-100 relative group"
              >
                <Cloud className="mx-auto mb-2 text-blue-500" size={48} />
                <p className="text-sm text-gray-700 font-semibold truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{file.size}</p>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="p-2 md:p-6 flex flex-col items-center gap-4">
          <div className="w-28 h-28 bg-gradient-to-tr from-blue-200 to-yellow-100 rounded-full shadow-inner border-4 border-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700">
            {profile.avatar}
          </div>

          {isEditingProfile ? (
            <div className="w-full max-w-md space-y-4">
              <Input
                placeholder="Аты"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                placeholder="Username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
              <Input
                placeholder="Био"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={saveProfile} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save size={18} className="mr-2" /> Сақтау
                </Button>
                <Button onClick={() => setIsEditingProfile(false)} variant="outline" className="flex-1">
                  Болдырмау
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-700">{profile.name}</h2>
              <p className="text-gray-600 text-sm">@{profile.username}</p>
              <p className="text-gray-500 text-center max-w-md">{profile.bio}</p>
              <Button onClick={() => setIsEditingProfile(true)} className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold">
                <Edit2 size={18} className="mr-2" /> Профильді өзгерту
              </Button>
            </>
          )}

          <div className="mt-8 w-full max-w-md">
            <Card className="bg-white/90">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-3 text-blue-700">Статистика</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Чаттар:</span>
                    <span className="font-semibold">{chats.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Хабарламалар:</span>
                    <span className="font-semibold">{messages.filter(m => m.sender === "user").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Файлдар:</span>
                    <span className="font-semibold">{cloudFiles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Посттар:</span>
                    <span className="font-semibold">{posts.filter(p => p.author === profile.name).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
