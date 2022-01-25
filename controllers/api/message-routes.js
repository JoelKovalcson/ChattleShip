const router = require("express").Router();
const { Message } = require("../../models");

router.get("/:id", (req, res) => {
  Message.findAll({
    where: {
      $or: [
        {
          to: req.session.user_id,
          from: req.params.id,
        },
        {
          to: req.params.id,
          from: req.session.user_id,
        },
      ],
    },
	limit: 20,
	order: [
		['created_at', 'DESC']
	]
  })
    .then((dbMessageData) => res.json(dbMessageData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post( "/", /*withAuth,*/ (req, res) => {
    Message.create({
      message: req.body.message,
      from: req.session.user_id,
      to: req.body.to,
    })
      .then((dbCommentData) => res.json(dbCommentData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
);

module.exports = router;
