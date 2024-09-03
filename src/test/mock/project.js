const projects = [
    {
        name: "Project Alpha",
        description:
            "A groundbreaking project focused on developing AI-based analytics tools.",
        team_size: 5,
        createdAt: "2024-01-15T10:30:00Z",
        attachments: {
            private: [
                {
                    link: "http://example.com/private-doc1",
                    folder: "docs/private",
                },
                {
                    image: "http://example.com/private-image1.jpg",
                    description: "Private image 1",
                },
            ],
            public: [
                {
                    gif: "http://example.com/public-animation1.gif",
                    description: "Public GIF animation",
                },
                {
                    video: "http://example.com/public-video1.mp4",
                    description: "Public video example",
                },
            ],
        },
    },
    {
        name: "Project Beta",
        description:
            "An innovative platform for improving online collaboration among teams.",
        team_size: 8,
        createdAt: "2024-03-22T14:45:00Z",
        attachments: {
            private: [
                {
                    audio: "http://example.com/private-audio1.mp3",
                    description: "Private audio recording",
                },
            ],
            public: [
                {
                    link: "http://example.com/public-resources",
                    description: "Publicly accessible resources",
                },
                {
                    image: "http://example.com/public-image1.jpg",
                    description: "Public project image",
                },
            ],
        },
    },
    {
        name: "Project Gamma",
        description:
            "A research project aimed at exploring new machine learning algorithms.",
        team_size: 3,
        createdAt: "2024-05-10T09:00:00Z",
        attachments: {
            private: [
                {
                    folder: "research-data",
                },
            ],
            public: [
                {
                    video: "http://example.com/public-research-video.mp4",
                    description: "Public research video",
                },
            ],
        },
    },
    {
        name: "Project Delta",
        description:
            "A development project for creating a new mobile application for fitness tracking.",
        team_size: 6,
        createdAt: "2024-06-05T16:20:00Z",
        attachments: {
            private: [
                {
                    image: "http://example.com/private-design1.png",
                    description: "Private design mockup",
                },
            ],
            public: [
                {
                    link: "http://example.com/public-tracking-app",
                    description: "Public link to the tracking app",
                },
            ],
        },
    },
    {
        name: "Project Epsilon",
        description:
            "A collaborative initiative to build a new cloud-based data storage solution.",
        team_size: 7,
        createdAt: "2024-08-30T11:15:00Z",
        attachments: {
            private: [
                {
                    video: "http://example.com/private-demo.mp4",
                    description: "Private demo video",
                },
            ],
            public: [
                {
                    gif: "http://example.com/public-cloud-animation.gif",
                    description: "Public cloud storage animation",
                },
                {
                    audio: "http://example.com/public-podcast.mp3",
                    description: "Public podcast episode",
                },
            ],
        },
    },
];

export default projects;
