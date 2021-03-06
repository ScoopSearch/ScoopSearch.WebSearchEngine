import React, { PureComponent } from 'react';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Img } from 'react-image';

import ManifestJson from '../serialization/ManifestJson';
import Utils from '../utils';
import CopyToClipboardButton from './CopyToClipboardButton';
import KnownBucketIcon from './KnownBucketIcon';
import StarsBadge from './StarsBadge';

dayjs.extend(localizedFormat);

type SearchResultProps = {
  result: ManifestJson;
  onCopyToClipbard: (content: string) => void;
};

class SearchResult extends PureComponent<SearchResultProps> {
  handleCopyToClipboard = (content: string): void => {
    const { onCopyToClipbard } = this.props;
    onCopyToClipbard(content);
  };

  private displayHighlight = (content?: string) => {
    return (
      content && (
        <span
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      )
    );
  };

  render(): JSX.Element {
    const { result } = this.props;
    const {
      id,
      score,
      name,
      favicon,
      highlightedName,
      highlightedDescription,
      highlightedLicense,
      highlightedRepository,
      highlightedAuthorName,
      highlightedVersion,
      metadata,
      homepage,
    } = result;

    return (
      <Card key={id} className="mb-2">
        <Card.Header>
          {favicon && (
            <Img className="mr-2" src={favicon} width={20} height={20} />
          )}
          <strong>{this.displayHighlight(highlightedName)}</strong>
          {' - '}
          {this.displayHighlight(highlightedVersion)}
          {metadata.repositoryOfficial && <KnownBucketIcon />}
          {process.env.NODE_ENV === 'development' && ` - @score: ${score}`}
        </Card.Header>
        <Card.Body>
          <Container>
            {highlightedDescription && (
              <Row className="mb-3">
                <Col>{this.displayHighlight(highlightedDescription)}</Col>
              </Row>
            )}
            <small>
              <Row>
                <Col lg={6}>
                  Updated: {dayjs(metadata.committed).format('LLL')}
                </Col>
                <Col lg={6}>
                  License: {this.displayHighlight(highlightedLicense)}
                </Col>
              </Row>

              <Row className="mb-2">
                <Col lg={6}>
                  Bucket:{' '}
                  <a href={metadata.repository}>
                    {this.displayHighlight(highlightedRepository)}
                  </a>
                  <StarsBadge stars={metadata.stars} />
                  {metadata.repositoryOfficial && <KnownBucketIcon />}
                  {!metadata.repositoryOfficial && (
                    <CopyToClipboardButton
                      className="ml-1 ms copyToClipbardMiniButton"
                      onClick={() =>
                        this.handleCopyToClipboard(
                          `scoop bucket add ${Utils.extractPathFromUrl(
                            metadata.repository,
                            '_'
                          )} ${metadata.repository}`
                        )
                      }
                    />
                  )}
                </Col>
                <Col lg={6}>
                  Commiter: {this.displayHighlight(highlightedAuthorName)}
                </Col>
              </Row>
              <Row className="text-center" noGutters>
                <Col lg xs={4} className="mt-1 mb-2">
                  <a href={homepage}>
                    Homepage <FaExternalLinkAlt />
                  </a>
                </Col>
                <Col lg xs={4} className="mt-1 mb-2">
                  <a
                    href={`${metadata.repository}/blob/master/${metadata.filePath}`}
                  >
                    Manifest <FaExternalLinkAlt />
                  </a>
                </Col>
                <Col lg xs={4} className="mt-1 mb-2">
                  <a href={`${metadata.repository}/commit/${metadata.sha}`}>
                    Commit <FaExternalLinkAlt />
                  </a>
                </Col>
                <Col lg={5}>
                  <InputGroup size="sm">
                    <InputGroup.Prepend>
                      <InputGroup.Text className="scoopCopyCommand border-right-0">
                        &gt;
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      className="border-left-0"
                      readOnly
                      type="text"
                      value={`scoop install ${name}`}
                    />

                    <InputGroup.Append>
                      <CopyToClipboardButton
                        onClick={() =>
                          this.handleCopyToClipboard(`scoop install ${name}`)
                        }
                      />
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Row>
            </small>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}

export default SearchResult;
