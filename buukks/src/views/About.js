import React from 'react';
import { ContentColumn } from '../layout';
import { PageHeader } from '../components/headers';

const About = () => {
  return (
    <div>
      <PageHeader>About Buukks</PageHeader>
      <ContentColumn>
        <p>Buukks is a project to easily keep track of and share what poeple are reading. It's being worked on by <a href="http://jackwreid.uk" target="_blank" rel="noopener">Jack Reid</a> and the code is in the open <a target="_blank" rel="noopener" href="https://github.com/JackWReid/buukks">here</a> and <a target="_blank" rel="noopener" href="https://github.com/JackWReid/buukksapi">here</a>.</p>
      </ContentColumn>
    </div>
  );
}

export default About;
