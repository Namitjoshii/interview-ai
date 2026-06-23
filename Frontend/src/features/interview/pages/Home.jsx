import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import posthog from 'posthog-js'

const Home = () => {

const { loading, generateReport, reports } = useInterview()
const [ jobDescription, setJobDescription ] = useState("")
const [ selfDescription, setSelfDescription ] = useState("")
const [ resumeFile, setResumeFile ] = useState(null)
const [ isDragging, setIsDragging ] = useState(false)
const resumeInputRef = useRef()

const navigate = useNavigate()

useEffect(() => {
    const blockDefault = (e) => e.preventDefault()
    window.addEventListener('dragover', blockDefault)
    window.addEventListener('drop', blockDefault)
    return () => {
        window.removeEventListener('dragover', blockDefault)
        window.removeEventListener('drop', blockDefault)
    }
}, [])

const validateAndSetFile = (file) => {
    if (!file) return
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!allowedTypes.includes(file.type)) {
        alert('Sirf PDF ya DOCX file upload karein.')
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        alert('File 5MB se badi hai.')
        return
    }
    setResumeFile(file)
}

const handleFileChange = (e) => {
    const file = e.target.files[0]
    validateAndSetFile(e.target.files[0])
    if (file) {
        posthog.capture('resume_uploaded', {
            file_type: file.type
        })
    }
}

const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    validateAndSetFile(e.dataTransfer.files[0])
    if (file) {
        posthog.capture('resume_uploaded', {
            file_type: file.type,
            upload_method: 'drag_drop'
        })
    }
}

const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
}

const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
}

const handleGenerateReport = async () => {
    posthog.capture('generate_button_clicked')
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })
    posthog.capture('report_generated', {
        has_resume: !!resumeFile,
        has_self_description: !!selfDescription,
        jd_length: jobDescription.length
    })
    navigate(`/interview/${data._id}`)
}

if (loading) {
    return (
        <main className='loading-screen'>
            <div className='loading-screen__spinner' />
            <h1>Building your preparation plan...</h1>
        </main>
    )
}

return (
    <div className='home-page'>

        <header className='page-header'>
            <div className='page-header__badge'>Interview AI</div>
            <h1>Prepare Smarter.<br /><span className='highlight'>Land the Role.</span></h1>
            <p>Tell us about the job and your background,I will build a personalized skill gap analysis and interview strategy.</p>
        </header>

        <div className='wizard'>

            {/* Step 1 */}
            <div className='wizard__step'>
                <div className='step-label'>
                    <span className='step-label__number'>01</span>
                    <span className='step-label__text'>Define Your Target Role</span>
                    <span className='badge badge--required'>Required</span>
                </div>
                <div className='step-card'>
                    <p className='step-card__hint'>Paste the full job description — title, responsibilities, requirements, everything.</p>
                    <div className='textarea-wrap'>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='step-textarea'
                            placeholder={`e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000</div>
                    </div>
                </div>
            </div>

            <div className='wizard__connector' />

            {/* Step 2 */}
            <div className='wizard__step'>
                <div className='step-label'>
                    <span className='step-label__number'>02</span>
                    <span className='step-label__text'>Upload Your Background</span>
                    <span className='badge badge--best'>Best Results</span>
                </div>
                <div className='step-card'>
                    <p className='step-card__hint'>Your resume helps us tailor the strategy to your actual experience level.</p>
                    <label
                        className={`dropzone ${isDragging ? 'dropzone--active' : ''} ${resumeFile ? 'dropzone--filled' : ''}`}
                        htmlFor='resume'
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <span className='dropzone__icon'>
                            {resumeFile ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                            )}
                        </span>
                        {resumeFile ? (
                            <>
                                <p className='dropzone__title'>{resumeFile.name}</p>
                                <p className='dropzone__subtitle'>Click or drop to replace</p>
                            </>
                        ) : (
                            <>
                                <p className='dropzone__title'>Click to upload or drag & drop</p>
                                <p className='dropzone__subtitle'>PDF or DOCX · Max 5MB</p>
                            </>
                        )}
                        <input
                            ref={resumeInputRef}
                            hidden
                            type='file'
                            id='resume'
                            name='resume'
                            accept='.pdf,.docx'
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            </div>

            <div className='wizard__connector' />

            {/* Step 3 */}
            <div className='wizard__step'>
                <div className='step-label'>
                    <span className='step-label__number'>03</span>
                    <span className='step-label__text'>Tell Us About Yourself</span>
                    <span className='badge badge--optional'>Optional</span>
                </div>
                <div className='step-card'>
                    <p className='step-card__hint'>No resume? Briefly describe your experience and skills instead.</p>
                    <textarea
                        value={selfDescription}
                        onChange={(e) => { setSelfDescription(e.target.value) }}
                        id='selfDescription'
                        name='selfDescription'
                        className='step-textarea step-textarea--short'
                        placeholder="e.g. 3 years of frontend experience with React, Node.js, worked on e-commerce products..."
                    />
                    <div className='info-box'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="#0d1117" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#0d1117" strokeWidth="2"/></svg>
                        <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className='wizard__cta'>
                <div className='cta-meta'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Personalized Skill Gap Analysis · ~30 seconds
                </div>
                <button
                    onClick={handleGenerateReport}
                    className='generate-btn'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                    Build My Preparation Plan
                </button>
            </div>

        </div>

        {reports.length > 0 && (
            <section className='recent-reports'>
                <h2>Recent Plans</h2>
                <ul className='reports-list'>
                    {reports.map(report => (
                        <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                            <h3>{report.title || 'Untitled Position'}</h3>
                            <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                            <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                Match Score: {report.matchScore}%
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        )}

        <footer className='page-footer'>
            <a href='#'>Privacy Policy</a>
            <a href='#'>Terms of Service</a>
            <a href='#'>Help Center</a>
        </footer>

    </div>
)
}

export default Home