const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
    test('returns a correctly formatted array of category objects', () => {
        return request(app).get('/api/categories').expect(200).then((response) => {
            response['body']['categories'].forEach(category => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            })
        })
    });
    test('returns a category array of the correct length', () => {
        return request(app).get('/api/categories').expect(200).then((response) => {
            expect(response.body.categories).toHaveLength(4);
        })
    });
});

describe('GET /api/reviews', () => {
    test('returns a correctly formatted array of reviews objects', () => {
        return request(app).get('/api/reviews').expect(200).then((response) => {
            response['body']['reviews'].forEach(category => {
                expect(category).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                });
            })
        })
    });
    test('returns a category array of the correct length', () => {
        return request(app).get('/api/reviews').expect(200).then((response) => {
            expect(response.body.reviews).toHaveLength(13);
        })
    });
    test('returns a category array sorted by date in ascending order', () => {
        return request(app).get('/api/reviews').expect(200).then((response) => {
            const reviews = [...response.body.reviews];
            reviews.sort(function (a , b) {
                return new Date(b.created_at) - new Date(a.created_at);
              });
            expect(reviews).toEqual(response.body.reviews);
        })
    });
    describe('GET /api/reviews/:review_id/comments', () => {
        test('returns with an array of comment objects', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const arrayOfComments = response.body.comments;
                arrayOfComments.forEach(comment => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: expect.any(Number)
                    })
                })
            })
        });
        test('returns with an array of the correct length and content for the review_id', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const arrayOfComments = response.body.comments;
                expect(arrayOfComments).toHaveLength(3)
                expect(arrayOfComments[0]).toMatchObject({
                    comment_id: 6,
                    body: 'Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite',
                    review_id: 3,
                    author: 'philippaclaire9',
                    votes: 10,
                    created_at: '2021-03-27T19:49:48.110Z'
                  })
            })
        });
        test('returns with an array sorted to have the most recent comments first', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const commentsCopy = [...response.body.comments];
            commentsCopy.sort(function (a , b) {
                return new Date(b.created_at) - new Date(a.created_at);
              });
            expect(commentsCopy).toEqual(response.body.comments);
            })
        });
        test('returns 200 and empty array if there are no comments for the review id', () => {
            return request(app).get('/api/reviews/1/comments').expect(200).then(response => {
                const arrayOfComments = response.body.comments;
                expect(arrayOfComments).toHaveLength(0)
                expect(arrayOfComments).toEqual([]);
            })
        });
    });
    describe('GET /api/reviews/:review_id', () => {
        test('responds with a review object', () => {
            return request(app).get('/api/reviews/1').expect(200).then((response) => {
                expect(response.body.review).toMatchObject({
                    review_id : 1,
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String)
                })
            })
        });
        test('responds with a the specifc review object requested', () => {
            return request(app).get('/api/reviews/4').expect(200).then((response) => {
                expect(response.body).toMatchObject({ review: {
                    review_id: 4,
                    title: 'Dolor reprehenderit',
                    designer: 'Gamey McGameface',
                    owner: 'mallionaire',
                    review_img_url: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700',
                    review_body: 'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod',
                    category: 'social deduction',
                    created_at: "2021-01-22T11:35:50.936Z",
                    votes: 7
                }})
            })
        });
    });
});

describe('PATCH /api/reviews/review_id', () => {
    test('returns with an updated review, with votes incremented by newVote', () => {
        return request(app).patch('/api/reviews/1').send({ inc_votes: 1 }).expect(200).then((response) => {
            expect(response.body.updatedReview).toMatchObject({
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: expect.any(String),
                votes: 2
            })
        })
    });
    test('returns 200 with a not updated review if given no values', () => {
        return request(app).patch('/api/reviews/1').send({ }).expect(200).then((response) => {
            expect(response.body.updatedReview).toMatchObject({
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: expect.any(String),
                votes: 1
            })
        })
    });
    test('returns 200 with a not updated review if given the wrong key', () => {
        return request(app).patch('/api/reviews/1').send({ timeOfYear: 'winter' }).expect(200).then((response) => {
            expect(response.body.updatedReview).toMatchObject({
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: expect.any(String),
                votes: 1
            })
        })
    });
});

describe('POST /api/reviews/:review_id/comments', () => {
    test('returns an object of the posted comment', () => {
        return request(app).post('/api/reviews/5/comments').send({ username: 'philippaclaire9', body: 'I hate this game, waste of my time'}).expect(201).then(response => {
            const comment = response.body.comment;
            expect(comment).toMatchObject({
                author: 'philippaclaire9', 
                body: 'I hate this game, waste of my time',
                comment_id: 7,
                created_at: expect.any(String), 
                review_id: 5, 
                votes: 0
            })
        })
    });
    test('returns a 201 with irrelevant properties ignored on the .send', () => {
        return request(app).post('/api/reviews/5/comments').send({ title: 'Mrs', username: 'philippaclaire9', body: 'I hate this game, waste of my time', rating: 2}).expect(201).then(response => {
            const comment = response.body.comment;
            expect(comment).toMatchObject({
                author: 'philippaclaire9', 
                body: 'I hate this game, waste of my time',
                comment_id: 7,
                created_at: expect.any(String), 
                review_id: 5, 
                votes: 0
            })
        })
    });
});

describe('GET /api/users', () => {
    test('returns with users objects', () => {
        return request(app).get('/api/users').expect(200).then(response => {
            const arrayOfUsers = response.body.users;
            arrayOfUsers.forEach(user => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
            expect(arrayOfUsers).toHaveLength(4)
        })
    });
});

describe('error handling', () => {
    test('returns 404 if path is not found', () => {
        return request(app).get('/api/notARoute').expect(404).then((response) => {
            expect(response._body.msg).toBe('path not found')
        })
    });
    test('returns a 400 if review_id is invalid when searching for reviews', () => {
        return request(app).get('/api/reviews/banana').expect(400).then((response) => {
            expect(response._body.msg).toBe('invalid input')
        })
    });
    test('returns a 400 if review_id is invalid when searching for comments', () => {
        return request(app).get('/api/reviews/banana/comments').expect(400).then((response) => {
            expect(response._body.msg).toBe('invalid input')
        })
    });
    test('returns a 404 if review_id is out of range when searching for reviews', () => {
        return request(app).get('/api/reviews/999').expect(404).then((response) => {
            expect(response._body.msg).toBe('review not found')
        })
    });
    test('returns a 400 if passed an invalid username', () => {
        return request(app).post('/api/reviews/WalterWhite/comments').send({ username: 'philippaclaire9', body: 'I hate this game, waste of my time'}).expect(400).then((response) => {
            expect(response._body.msg).toBe('invalid input')
        })
    });
    test('returns a 404 for a non-existent id', () => {
        return request(app).post('/api/reviews/999/comments').send({ username: 'philippaclaire9', body: 'I hate this game, waste of my time'}).expect(404).then((response) => {
            expect(response._body.msg).toBe('404: could not find matches in database for your input')
        })
    });
    test('returns 400 if their are missing properties on a post request', () => {
        return request(app).post('/api/reviews/999/comments').send({ username: 'philippaclaire9'}).expect(400).then((response) => {
            expect(response._body.msg).toBe('missing required input')
        })
    });
    test('returns a 404 if review_id is out of range when searching for comments', () => {
        return request(app).get('/api/reviews/999/comments').expect(404).then((response) => {
            expect(response._body.msg).toBe('review id not found')
        })
    });
    test('returns a 400 if inc_votes is not a number', () => {
        return request(app).patch('/api/reviews/1').send({ inc_votes: 'hello' }).expect(400).then((response) => {
            expect(response.body.msg).toBe('invalid type of incriment votes')
        })
    });
    test('returns a 400 if review_id is invalid on a patch', () => {
        return request(app).patch('/api/reviews/banana').send({ inc_votes: 1 }).expect(400).then((response) => {
            expect(response.body.msg).toBe('invalid input')
        })
    });
    test('returns a 404 if review_id is not found on a patch', () => {
        return request(app).patch('/api/reviews/999').send({ inc_votes: 1 }).expect(404).then((response) => {
            expect(response.body.msg).toBe('review id not found')
        })
    });
});