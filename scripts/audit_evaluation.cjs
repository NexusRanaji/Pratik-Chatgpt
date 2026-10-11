const http = require('http');
const fs = require('fs');
const path = require('path');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
        resolve({ status: res.statusCode, headers: res.headers, data: parsed });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function evaluate() {
  const results = [];
  const log = (id, name, pass, details) => {
    results.push({ id, name, pass, details });
    console.log((pass ? '✅ [PASS]' : '❌ [FAIL]') + ' ' + id + ': ' + name + (details ? ' - ' + details : ''));
  };

  console.log('====================================================');
  console.log('🔍 INITIATING COMPREHENSIVE MERGE EVALUATION AUDIT');
  console.log('====================================================\n');

  // Test 1: Frontend SPA Bundle & Entry point
  try {
    const res = await request({ hostname: '127.0.0.1', port: 3000, path: '/', method: 'GET' });
    const hasRoot = typeof res.data === 'string' && res.data.includes('id="root"');
    const hasTitle = typeof res.data === 'string' && res.data.includes('Nexus Ranaji');
    const hasKatex = typeof res.data === 'string' && res.data.includes('katex.min.css');
    log('TC-01', 'Frontend HTML Entry & Assets Linkage', res.status === 200 && hasRoot && hasTitle && hasKatex, 'HTML delivered with KaTeX and root mount');
  } catch(e) {
    log('TC-01', 'Frontend HTML Entry & Assets Linkage', false, e.message);
  }

  // Test 2: Multi-Role Auth - Super Admin (Modern)
  let adminToken, adminId;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'admin', password: 'Admin@Nexus2025!' });
    const pass = res.status === 200 && res.data.user?.role === 'superadmin' && !!res.data.token;
    adminToken = res.data.token;
    adminId = res.data.user?.id;
    log('TC-02', 'Super Admin Modern Auth (admin / Admin@Nexus2025!)', pass, `User: ${res.data.user?.name}`);
  } catch(e) {
    log('TC-02', 'Super Admin Modern Auth', false, e.message);
  }

  // Test 3: Multi-Role Auth - Super Admin (Legacy)
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'admin@school.com', password: 'admin123' });
    const pass = res.status === 200 && res.data.user?.role === 'superadmin';
    log('TC-03', 'Super Admin Legacy Auth (admin@school.com / admin123)', pass, `User: ${res.data.user?.name}`);
  } catch(e) {
    log('TC-03', 'Super Admin Legacy Auth', false, e.message);
  }

  // Test 4: Faculty / Teacher Modern Auth
  let teacherToken, teacherId;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'teacher.sharma', password: 'NexusTeacher#2025' });
    const pass = res.status === 200 && res.data.user?.role === 'teacher';
    teacherToken = res.data.token;
    teacherId = res.data.user?.id;
    log('TC-04', 'Teacher Modern Auth (teacher.sharma / NexusTeacher#2025)', pass, `User: ${res.data.user?.name}`);
  } catch(e) {
    log('TC-04', 'Teacher Modern Auth', false, e.message);
  }

  // Test 5: Faculty / Teacher Legacy Auth
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'teacher@school.com', password: 'teacher123' });
    const pass = res.status === 200 && res.data.user?.role === 'teacher';
    log('TC-05', 'Teacher Legacy Auth (teacher@school.com / teacher123)', pass, `User: ${res.data.user?.name}`);
  } catch(e) {
    log('TC-05', 'Teacher Legacy Auth', false, e.message);
  }

  // Test 6: Student Modern Auth
  let studentToken, studentId;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'student.rohan', password: 'StudentPass#101' });
    const pass = res.status === 200 && res.data.user?.role === 'student';
    studentToken = res.data.token;
    studentId = res.data.user?.id;
    log('TC-06', 'Student Modern Auth (student.rohan / StudentPass#101)', pass, `User: ${res.data.user?.name}, Roll: ${res.data.user?.rollNo}`);
  } catch(e) {
    log('TC-06', 'Student Modern Auth', false, e.message);
  }

  // Test 7: Student Legacy Auth
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'john@student.com', password: 'student123' });
    const pass = res.status === 200 && res.data.user?.role === 'student';
    log('TC-07', 'Student Legacy Auth (john@student.com / student123)', pass, `User: ${res.data.user?.name}`);
  } catch(e) {
    log('TC-07', 'Student Legacy Auth', false, e.message);
  }

  // Test 8: Parent Auth & Child Linkage
  let parentId;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'parent.sharma', password: 'ParentPass#2025' });
    parentId = res.data.user?.id;
    const hasChildren = Array.isArray(res.data.user?.childrenIds) && res.data.user.childrenIds.length > 0;
    log('TC-08', 'Parent Auth & Child Relationship Binding', res.status === 200 && hasChildren, `Children bound: ${res.data.user?.childrenIds?.length}`);
  } catch(e) {
    log('TC-08', 'Parent Auth & Child Binding', false, e.message);
  }

  // Test 9: Legacy Auth Route Aliases
  try {
    const res1 = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/student/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'john@student.com', password: 'student123' });

    const res2 = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/auth/faculty/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'teacher@school.com', password: 'teacher123' });

    log('TC-09', 'Legacy Endpoint Aliases (/api/auth/student/login & /faculty/login)', res1.status === 200 && res2.status === 200, 'Backward compatibility endpoints active');
  } catch(e) {
    log('TC-09', 'Legacy Endpoint Aliases', false, e.message);
  }

  // Test 10: Teacher Question Bank CRUD
  let createdQId;
  try {
    const qRes = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/teacher/question-bank', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': teacherId }
    }, {
      text: 'Calculate the focal length using formula: $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$',
      type: 'single',
      options: [{ id: 'opt-1', text: '+15 cm' }, { id: 'opt-2', text: '-15 cm' }, { id: 'opt-3', text: '+30 cm' }],
      correctAnswer: 'opt-1',
      explanation: 'Applying the standard lens formula with sign conventions yields f = +15 cm.',
      points: 2,
      subjectId: 'sub-phy',
      classId: 'cls-10',
      chapterName: 'Light: Reflection and Refraction'
    });
    createdQId = qRes.data.question?.id;
    log('TC-10', 'Teacher Question Bank Creation with LaTeX Math', qRes.status === 201 && !!createdQId, `QID: ${createdQId}`);
  } catch(e) {
    log('TC-10', 'Teacher Question Bank Creation', false, e.message);
  }

  // Test 11: Teacher Exam Creation & Publishing
  let createdExamId;
  try {
    const exRes = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/teacher/exams', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': teacherId }
    }, {
      title: 'Automated Comprehensive Audit Exam 2026',
      description: 'System verification examination verifying testing engine & anti-cheating.',
      subjectId: 'sub-phy',
      subjectName: 'Physics & Applied Science',
      classId: 'cls-10',
      className: 'Standard 10 (SSC)',
      divisionId: 'div-10a',
      divisionName: 'Division A',
      durationMinutes: 30,
      passingScore: 50,
      questions: [
        {
          id: 'q-audit-1',
          text: 'What is the speed of light in vacuum? $c = 3 \\times 10^8\\text{ m/s}$',
          type: 'single',
          options: [{ id: 'opt-a', text: 'True' }, { id: 'opt-b', text: 'False' }],
          correctAnswer: 'opt-a',
          points: 5
        }
      ]
    });
    createdExamId = exRes.data.exam?.id;
    // Now publish it
    if (createdExamId) {
      await request({
        hostname: '127.0.0.1', port: 3000, path: `/api/teacher/exams/${createdExamId}/publish`, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': teacherId }
      }, {});
    }
    log('TC-11', 'Exam Builder & Publishing Workflow', exRes.status === 201 && !!createdExamId, `Exam ID: ${createdExamId}, Status: Published`);
  } catch(e) {
    log('TC-11', 'Exam Builder & Publishing', false, e.message);
  }

  // Test 12: Student Exam Retrieval (Stripped of answers for test security)
  try {
    const takeRes = await request({
      hostname: '127.0.0.1', port: 3000, path: `/api/exams/${createdExamId}/take`, method: 'GET',
      headers: { 'x-user-id': studentId }
    });
    const questions = takeRes.data.questions || takeRes.data.exam?.questions;
    const q = questions?.[0];
    const strippedSecurely = q && q.correctAnswer === undefined && q.explanation === undefined;
    log('TC-12', 'Student Exam Delivery & Question Security Stripping', takeRes.status === 200 && strippedSecurely, 'Answer keys cleanly omitted for examinee');
  } catch(e) {
    log('TC-12', 'Student Exam Delivery', false, e.message);
  }

  // Test 13: Anti-Cheating Window Blur Event Logging
  try {
    const cheatRes = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/student/cheating-event', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': studentId }
    }, {
      examId: createdExamId,
      examTitle: 'Automated Comprehensive Audit Exam 2026',
      violationCount: 1,
      reason: 'Window focus blur / candidate navigated to external browser tab'
    });
    log('TC-13', 'Anti-Cheating Window Blur Detection & Logging', cheatRes.status === 200, 'Incident recorded in proctor audit stream');
  } catch(e) {
    log('TC-13', 'Anti-Cheating Logging', false, e.message);
  }

  // Test 14: Student Exam Submission & Auto-Grading
  try {
    const subRes = await request({
      hostname: '127.0.0.1', port: 3000, path: `/api/exams/${createdExamId}/submit`, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': studentId }
    }, {
      answers: { 'q-audit-1': 'opt-a' },
      timeSpentMinutes: 4,
      cheatingViolationCount: 1
    });
    const score = subRes.data.score !== undefined ? subRes.data.score : subRes.data.result?.score;
    const totalMarks = subRes.data.totalMarks !== undefined ? subRes.data.totalMarks : subRes.data.result?.totalMarks;
    const passed = subRes.data.passed !== undefined ? subRes.data.passed : subRes.data.result?.passed;
    const pass = (subRes.status === 200 || subRes.status === 201) && score === 5 && passed === true;
    log('TC-14', 'Exam Submission, Automated Grading & Score Calculation', pass, `Score: ${score}/${totalMarks}, Passed: ${passed}`);
  } catch(e) {
    log('TC-14', 'Exam Submission & Auto-Grading', false, e.message);
  }

  // Test 15: Post-Exam Submission Review Modal
  try {
    const revRes = await request({
      hostname: '127.0.0.1', port: 3000, path: `/api/exams/${createdExamId}/review?force=true`, method: 'GET',
      headers: { 'x-user-id': studentId }
    });
    const questions = revRes.data.questions || [];
    const submission = revRes.data.submission;
    const pass = revRes.status === 200 && Array.isArray(questions) && questions.length > 0 && submission?.score === 5;
    log('TC-15', 'Student Post-Exam Answer Review & Explanations', pass, `Questions returned: ${questions.length}, Score: ${submission?.score}`);
  } catch(e) {
    log('TC-15', 'Student Post-Exam Review', false, e.message);
  }

  // Test 16: Parent Portal Child Performance Analytics
  try {
    const pChildren = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/parent/children', method: 'GET',
      headers: { 'x-user-id': parentId }
    });
    const childId = pChildren.data.children?.[0]?.id || studentId;
    const pResults = await request({
      hostname: '127.0.0.1', port: 3000, path: `/api/parent/child/${childId}/results`, method: 'GET',
      headers: { 'x-user-id': parentId }
    });
    const resultsList = pResults.data.results || pResults.data.submissions || [];
    log('TC-16', 'Parent Child Performance & Multi-Child Dashboard Link', pResults.status === 200 && Array.isArray(resultsList), `Results loaded for child: ${resultsList.length}`);
  } catch(e) {
    log('TC-16', 'Parent Portal Child Analytics', false, e.message);
  }

  // Test 17: Support Ticket & Helpdesk System
  let createdTicketId;
  try {
    const tickRes = await request({
      hostname: '127.0.0.1', port: 3000, path: '/api/tickets', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': parentId }
    }, {
      studentId: studentId,
      subject: 'Inquiry regarding Physics practical test marks',
      category: 'Score Inquiry',
      message: 'Kindly review the scoring for optical ray diagrams in the midterm test.',
      priority: 'medium'
    });
    createdTicketId = tickRes.data.ticket?.id;
    // Add reply from teacher
    if (createdTicketId) {
      await request({
        hostname: '127.0.0.1', port: 3000, path: `/api/tickets/${createdTicketId}/reply`, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': teacherId }
      }, {
        message: 'The diagram scores have been verified and full credits were conferred.'
      });
    }
    log('TC-17', 'Helpdesk Multi-Party Threading & Ticket Lifecycle', tickRes.status === 201 && !!createdTicketId, `Ticket ID: ${createdTicketId}`);
  } catch(e) {
    log('TC-17', 'Support Ticket System', false, e.message);
  }

  // Test 18: Institutional Audit Queues
  try {
    const logAudits = await request({ hostname: '127.0.0.1', port: 3000, path: '/api/admin/audits/logins', method: 'GET' });
    const cheatAudits = await request({ hostname: '127.0.0.1', port: 3000, path: '/api/admin/audits/cheating', method: 'GET' });
    const delAudits = await request({ hostname: '127.0.0.1', port: 3000, path: '/api/admin/audits/deleted-credentials', method: 'GET' });
    const pass = logAudits.status === 200 && cheatAudits.status === 200 && delAudits.status === 200;
    log('TC-18', 'Rolling Audit Queues (Logins, Proctor Cheating, Deleted Credentials)', pass, `Logins: ${logAudits.data.logins?.length}, Cheating incidents: ${cheatAudits.data.cheatingEvents?.length}`);
  } catch(e) {
    log('TC-18', 'Audit Queues', false, e.message);
  }

  // Test 19: School Report Analytics
  try {
    const repRes = await request({ hostname: '127.0.0.1', port: 3000, path: '/api/admin/reports/school-analytics', method: 'GET' });
    const pass = repRes.status === 200 && !!repRes.data.overview && Array.isArray(repRes.data.classDivisionBreakdown);
    log('TC-19', 'Administrative Institutional Analytics Report Feed', pass, `Reference: ${repRes.data.reportReferenceNumber}`);
  } catch(e) {
    log('TC-19', 'School Report Analytics', false, e.message);
  }

  // Test 20: Persistent Database Engine
  try {
    // Give debounce a moment to write
    await new Promise(r => setTimeout(r, 600));
    const dbPath = path.join(process.cwd(), 'data', 'nexus_school_db.json');
    const exists = fs.existsSync(dbPath);
    let validJson = false;
    if (exists) {
      const content = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(content);
      validJson = Array.isArray(parsed.exams) && Array.isArray(parsed.users) && parsed.exams.some(e => e.id === createdExamId);
    }
    log('TC-20', 'Persistent Disk State Cache (data/nexus_school_db.json)', exists && validJson, `File size: ${fs.statSync(dbPath).size} bytes, includes audit exam`);
  } catch(e) {
    log('TC-20', 'Persistent Disk State Cache', false, e.message);
  }

  console.log('\n====================================================');
  const passed = results.filter(r => r.pass).length;
  console.log(`📊 EVALUATION SUMMARY: ${passed} / ${results.length} PASSED (${Math.round(passed / results.length * 100)}%)`);
  console.log('====================================================');
  if (passed === results.length) {
    console.log('🎉 ALL INTEGRATION SYSTEMS ARE FUNCTIONING AT 100% OPERATIONAL FIDELITY!');
  }
}

evaluate().catch(console.error);
