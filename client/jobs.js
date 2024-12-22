const jobs = [
    {
        id: '1',
        title: 'Frontend Developer',
        company: 'TechCorp',
        location: 'New York, NY',
        type: 'Full-time',
        experience: 'Mid',
        description: 'We are looking for a skilled Frontend Developer to join our team...'
    },
    {
        id: '2',
        title: 'Backend Engineer',
        company: 'DataSystems',
        location: 'San Francisco, CA',
        type: 'Full-time',
        experience: 'Senior',
        description: 'Seeking an experienced Backend Engineer to build scalable systems...'
    },
    {
        id: '3',
        title: 'UX Designer Intern',
        company: 'CreativeMinds',
        location: 'Remote',
        type: 'Internship',
        experience: 'Entry',
        description: 'Great opportunity for a UX Designer to gain hands-on experience...'
    },
    {
        id: '4',
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Seattle, WA',
        type: 'Full-time',
        experience: 'Mid',
        description: 'Join our team to build and maintain our cloud infrastructure...'
    },
    {
        id: '5',
        title: 'Mobile App Developer',
        company: 'AppWorks',
        location: 'Austin, TX',
        type: 'Contract',
        experience: 'Senior',
        description: 'Develop cutting-edge mobile applications for iOS and Android...'
    }
];

const jobList = document.getElementById('job-list');
const searchInput = document.getElementById('search-input');
const jobTypeSelect = document.getElementById('job-type');
const experienceSelect = document.getElementById('experience');
const searchButton = document.getElementById('search-button');

function createJobItem(job) {
    const jobItem = document.createElement('div');
    jobItem.classList.add('job-item');
    jobItem.innerHTML = `
        <h2>${job.title}</h2>
        <p>${job.company} - ${job.location}</p>
        <p class="job-meta">${job.type} • ${job.experience} level</p>
        <p>${job.description.substring(0, 100)}...</p>
    `;
    jobItem.addEventListener('click', () => {
        // Redirect to email generation page
        window.location.href = `email-generation.html?id=${job.id}`;
    });
    return jobItem;
}

function renderJobs(jobsToRender) {
    jobList.innerHTML = '';
    jobsToRender.forEach(job => {
        jobList.appendChild(createJobItem(job));
    });
}

function filterJobs() {
    const searchTerm = searchInput.value.toLowerCase();
    const jobType = jobTypeSelect.value;
    const experience = experienceSelect.value;

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                              job.company.toLowerCase().includes(searchTerm) ||
                              job.description.toLowerCase().includes(searchTerm);
        const matchesType = !jobType || job.type === jobType;
        const matchesExperience = !experience || job.experience === experience;

        return matchesSearch && matchesType && matchesExperience;
    });

    renderJobs(filteredJobs);
}

searchButton.addEventListener('click', filterJobs);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filterJobs();
    }
});

// Initial render
renderJobs(jobs);

function createJobItem(job) {
    const jobItem = document.createElement('div');
    jobItem.classList.add('job-item');
    jobItem.innerHTML = `
        <h2>${job.title}</h2>
        <p>${job.company} - ${job.location}</p>
        <p class="job-meta">${job.type} • ${job.experience} level</p>
        <p>${job.description.substring(0, 100)}...</p>
    `;
    jobItem.addEventListener('click', () => {
        // Save job details to localStorage
        localStorage.setItem('selectedJob', JSON.stringify(job));
        // Redirect to email generation page
        window.location.href = `email-generation.html`;
    });
    return jobItem;
}