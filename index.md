# Git by example

A great guide if you are age 4 or over is available [here](https://www.youtube.com/watch?v=1ffBJ4sVUb4).

Where shell commands are given in this document, commands for POSIX shells are
prefixed with `$` and commands for Windows shell are prefixed by `>`.  If no
Windows command is given, then the Windows command is the same as the POSIX one.
Lines beginning with a `#` are comments, and can be omitted.

A cheatsheet is at the end of this document.

# Introduction - What is Git?

Is it source control?  Is it versioning software?  Is it X?

*NO*

Dictionary:

	Git (adjective) [British English] - an unpleasant person

Torvalds:

> I'm an egotistical bastard, and I name all my projects after myself.
> First 'Linux', now 'git'.

Manpage:

	$ man git
	
	NAME
		   git - the stupid content tracker

	SYNOPSIS
		   git [--version] [--help] [-C <path>] [-c <name>=<value>]
			   [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
			   [-p|--paginate|--no-pager] [--no-replace-objects] [--bare]
			   [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
			   <command> [<args>]

	DESCRIPTION
		   Git is a fast, scalable, distributed revision control system with an unusually rich command set that provides both high-level operations and full access to internals.

		   See gittutorial(7) to get started, then see giteveryday(7) for a useful minimum set of commands. The Git User’s Manual[1] has a more in-depth introduction.

		   After you mastered the basic concepts, you can come back to this page to learn what commands Git offers. You can learn more about individual Git commands with "git help command". gitcli(7) manual page gives you an overview
		   of the command-line command syntax.

		   Formatted and hyperlinked version of the latest Git documentation can be viewed at http://git-htmldocs.googlecode.com/git/git.html.

	...


The key word there is _distributed_.  It is a very simple content-tracker. Where
most revision control systems aredesigned to be used in conjunction with some
central server, and are pretty much useless without it, Git is designed to be
fully-capable when run locally on one machine - the remote communication
abilities of git could almost be considered an "afterthought", given that a
local Git repository offers more power and flexibility than most traditional
"centralised" revision control systems.  This isn't a criticism of Git's remote
capabilities, merely a testament to how much can be done with it **without**
hooking it up to some central server.

To those familiar with other systems, Git can seem very strange and unintuitive.
You'll find constant references to graph theory and checksums when reading Git's
manual, which can make it seem overcomplicated at first.  In practise, this is
actually a side-effect of the simplicity of Git's design - you're much closer to
the internals of the system with Git than with typical systems.  This makes it
easier to understand what Git is actually doing when you give it a command, so
you're less likely to get unexpected behaviour and thus less likely to piss off
all your colleagues.

Git had several key design criteria:

 * Speed.  To be useful for Linux kernel development, it must be able to support
   hundreds of concurrent users and still have response times of at most a few
   seconds.  In the case of the Linux kernel, there are around 2,000 developers
   working from locations worldwide, with a code-base containing approximately
   20,000,000 lines of code as of kernel 4.0.

 * Be distributed.  There's that word again - I'll explain it in more detail
   soon.

 * Be extremely resilient.  It must be damn-near impossible for data in a
   repository to be corrupted either accidentally or maliciously and
   intentionally.  This design goal vindicated itself in 2011, when the
   kernel.org site was hacked.  Later, we'll come onto how the source code
   remained safe despite the "central" server being completely raped.
   
 * To date, the only serious security vulnerability regarding Git was caused by
   deficiencies in Microsoft's NTFS and Apple's HFS+ file systems.  While
   Microsoft fixed their vulnerability, Apple actively refused to fix theirs,
   so some Git operations may fail in Apple HFS+ filesystems if Git cannot
   guarantee being able to execute the action securely.

 * Take CVS as an example of what **not** to do.  If in doubt over how to do
   something, do the opposite of what CVS does.

# What's the fuss with "distributed"?

When 1000+ kernel developers are working on the same codebase, that could create
a lot of traffic for a centralised control system.  Additionally, developers
don't like having their workflow interrupted by a flakey internet connection.

Hence, all of git's "remote" capabilities are also possible "locally", with no
remote server even configured.  You can use whatever workflow you want to develop
features locally, as long as you follow the community/group/organisation rules
when you push the result of your work to the shared repository.

In order to explain any more at this point, it becomes necessary to show a few
Git commands.

# Basic Git usage

## Structure of a git repository

A typical Git repository is just a normal folder which contains a `.git` folder
within it.  This `.git` folder holds all the data required for managing the
repository, so you don't end up with `.svn` folders scattered all over your
project.

Files not in a Git repository:

	~/not-a-repository
		my-file
		my-folder/
			my-other-file

Same files now in a Git repository:

	~/a-git-repository
		my-file
		my-folder/
			my-other-file
	
		.git/
			config
			description
			HEAD
			branches/
			hooks/
			info/
			objects/
			refs/
		
99.9% of Git users will never need to look inside the `.git` folder.  On most
UNIX-like systems they won't even see it, as prefixing a filename with a dot
is similar to marking a file as "Hidden" in Windows.

A typical Git repository has three main components that one should be aware of:

 * The working tree ("your files")

 * The staging area (also called the "index")

 * History ("the repository" or "branches, commits, tags and all that stuff")

You edit your files as you usually would, in the working tree.  You then stage
the changes, which stores copies of them in the staging area.  You then commit
the changes.  The history is a collection of commits.  When you "download" a
repository via Git (typically via `git clone`) then you are receiving the
history as a series of commits.  When you publish local changes to a remote
repository, you "upload" your commits.

### Working tree

This is where your files would normally be if you weren't using Git to track
them.  Editing your files is no different when you have them in a Git
repository.

### Staging area

When you want to "check in" a load of changes, you **stage** them then you
**commit** them.  The staging area contains the changes that you want to commit
to the repository.

## Creating Git repositories

Create a new repository in a new folder:

	mkdir my-project
	cd my-project
	git init

Create a repository in an existing folder:

	cd my-project
	git init

Create a repository in the current folder:

	git init

Create a bare repository (we'll come onto what these are later):

	git init --bare

## Working in the working tree

Create a new repository:

	$ mkdir git-demo
	$ cd git-demo
	$ git init

Let's create a file in the working tree:

	$ echo Hello > my-file
	$ echo World >> my-file

Let's check the status of the repository:

	$ git status

	Untracked files:
		my-file

Git tells us that the file is not being tracked - so now let's stage the file:

	$ git add my-file

Let's check the status again:

	$ git status

	Changes to be committed:
		new file: my-file

Great - Git knows about the file now!  Let's add the file to our history by
committing it:

	$ git commit

If you have not used Git yet, then it may ask you to configure your name and
e-mail address - follow the instructions that Git gives, then try `git commit`
again.

An editor opened and we are prompted for a commit message - let's call it "Added
my-file".  Save your commit message and close the editor.

Let's view the history:

	$ git log

	commit [hexadecimal hash]
	Author: [your name] <[your e-mail]>
	Date: [commit date/time]

		Added my-file

You may find it useful to use the following instead.  I have it aliased to `gl1`:

	$ git log --format=oneline

	* [hexadecimal hash] Added my-file

Now let's add another file:

	$ echo Hi > other-file

	$ git status

	Untracked files:
		other-file

	$ git status

	Changes to be committed:
		new file: other-file

	$ git commit -m 'Added other-file'

	$ git status

	nothing to commit, working directory clean

	$ git log --format=oneline

	[hexadecimal hash] Added other-file
	[hexadecimal hsah] Added my-file

Note that we used `git commit -m <message>` to specify a commit message on the
command line instead of via a text editor.  The `git status` commands are
optional, I put those in so you can see the effects of the other commands.

## Undelete

Let's delete `other-file`:

POSIX:

	$ rm my-file

Windows:

	> del my-file

Oops!  We deleted the wrong file.  To restore it, we have several options:

### Restore a single file:

	$ git checkout my-file

Note that if we have added a file to the staging area, we can restore it via
this method even if the file is not committed.

	$ echo Corruption > my-file

Oops, we wrecked the file.  Again, we can restore it to the last staged/committed
version via `git checkout`.

	$ git checkout my-file

Now let's screw things up a bit more:

POSIX:

	$ rm *

Windows:

	> del *

Oops!  We deleted all our files from the repository!

### Restore the entire working tree

	$ git checkout .

This will restore the current directory and everything inside it to the contents
of the staging area and the current commit (HEAD).  We'll come onto HEAD a bit
later.

## Removing a file

So now let's remove that file as we originally wanted to:

POSIX:

	$ rm other-file

Windows:

	> del other-file

Check the status:

	$ git status

	Changes not staged for commit:
		deleted: other-file

Stage the change:

	$ git add other-file

	(or)

	$ git rm other-file

Check the status:

	$ git status

	Changes to be committed:
		deleted: other-file

Actually, let's un-stage this change so I can show another way to stage changes:

	$ git reset HEAD other-file

	Unstaged changes after reset:
	D	other-file

This hasn't restored the file, it has simply un-staged the change.  If we check
the status:

	$ git status

	Changes not staged for commit:
		deleted: other-file

## Staging many changes at once

To restore the file to the working tree, we would use `git checkout other-file`
as we used previously.  But we don't want to restore it in this case, we want to
delete it:

	$ git rm other-file

	$ git commit -m 'Removed other-file'

`git rm` removes the file and also stages the change.  You can also use `git mv`
to move a file and stage the change.  By telling Git that you've moved the file,
we guarantee that Git won't think that the new filename is a totally new file -
so Git won't end up with two copies of the same data in its history.  Git is
fairly smart though, and can often detect moves/renames even if the file has also
been edited a little.  This is useful as I always forget to use `git mv`...

I also always forget to use `git rm`.  After a large refactor, I may have
added/removed/moved/renamed many files.  Rather than trying to describe each
change to git with individual staging commands:

	$ git add file1 file2 dirA/file3 .......
	$ git rm file4 dirB/ dirC/ ...
	$ git mv blah bleh ...

Git provides some useful shorthands:

	$ git add -u

Updates files which Git is already tracking.  Files which we have already
been staged or committed will be checked for changes, and the changes will be
staged.  Deletion counts as a "change".  Untracked files will not be staged by
this.

	$ git add -A

Like `git add -u`, but also stages untracked files.  This is a **really** useful
command, as **any** changes will be staged.  Think before you type though, so
you don't commit anything that you don't want to commit yet.

You could of course stage all changes with `git add -A`, then unstage specific
changes with `git reset HEAD <path>` if you want to stage **most** changes.

Again, `git status` is your friend if you want to know what has changed and which
changes have been staged.

## Viewing changes (diff)

	$ echo Hello > my-file
	$ echo Estonia >> my-file

To view changes between a file and the index, use `git diff [<filename>]`:

	$ git diff

	...
	@@ -1,2 +1,2 @@
	 Hello
	-World
	+Estonia

This would show changes to all files - to view changes to a particular file,
pass a filename:

	$ git diff my-file

	(same result as before)

To view the changes between the current state and a particular commit, use
`git diff [<first few digits of commit ID>]`

	$ git log --format=oneline

	...
	7ccf142fff1c5f0a6e11ea6d07f3b144402034ff Added my-file

	$ git diff 7ccf

	(same result as before)

If we want to view the changes between commit A and B, we can use
`git diff <commit A checksum> <commit B checksum>`

To prevent `git diff` from accidentally interpreting a filename as a commit ID,
you can put `--` before the filenames:

	$ git diff -- [<path>] [<path>] ...

	$ git diff <commit> -- [<path>] [<path>] ...

	$ git diff <commit A> <commit B> -- [<path>] [<path>] ...

You do not need to specify the entire checksum, the first four digits are usually
sufficient.

## Undo

### Working tree

To revert/restore files in the working tree, we can use `git checkout`:

	$ git checkout file-to-restore

	$ git checkout path-to-restore/

This restores the working tree from the staging area if possible, or HEAD
otherwise.  There's the mysterious **HEAD** again, I promise I'll come onto it
soon!

### Staging area (index)

To unstage a change, we use `git reset`:

	$ git reset HEAD file-to-unstage

	$ git reset HEAD path-to-restore/

This does not affect the working tree, it simply makes Git forget about changes
we had staged previously.

### History

See next section


## Time-travel: using the history

Now it's time for me to go hardcore on yo asses.  In this section, we'll finally
learn what **HEAD** is, and maybe learn some basic graph theory too.  From here,
we will get onto branching, commit chains, and using Git's history.

When we create a **commit**, the following data is stored:

 * Committer's name, e-mail address

 * The date and time

 * Our staged changes

 * A checksum

 * The parent commit

The first three we have already seen, however the last two are important
concepts for anyone who wants to get the most out of Git.  I assume that you
know what a checksum (or "hash") is - if not, consult
[Wikipedia](http://en.wikipedia.org/wiki/Checksum).

### That weird hexadecimal crap

Commits are identified by their checksum.  This means that the "ID" of a commit
is dependent on the contents of the commit.  Hence, if the contents of the commit
are modified, then it's checksum will change and any references to it will fail.
This functions as a security feature and as a way to detect corruption.

But how can we tell if some evil hacker has inserted a new commit into our
history and just modified the parent commits in a similar way to inserting data
into a linked list?  Simple - the checksum of a commit is a checksum of not just
its data, but also of the previous commit's checksum.  If the history chain is
modified at all, the checksums will all change.  Since Git is decentralised,
everyone has their own local copy of the repository's history, so when they try
to synchronize (push/pull) with the corrupted one, they will be notified that
there is something wrong, and can restore the repository's history from their
own local copies.

Git uses the SHA1 hashing algorithm.

### HEAD

Finally.  HEAD.  What is it?

Slight anti-climax - HEAD is simply a pointer to the commit that we're basing our
current changes on.  When we tell git to stage changes, it looks at changes
between the files in our working tree and the commit that HEAD points to.

HEAD can also point to branches, which in turn point to commits.  No matter what
HEAD directly points to, it ultimately identifies a commit.

When we create a new commit, that commit becomes HEAD.  If we create another
commit after this, the new commit becomes HEAD and so forth.

### Directed acyclic graphs

There are two types of DAG:

 * A [small four-legged animal](https://www.youtube.com/watch?v=zH64dlgyydM)

 * A directed acyclic graph

We are concerned with the latter type of DAG.

Each of our commits points to one or zero parent commits.  Thus, from any
commit **X**, we can form a chain which goes back to some initial commit.  This
chain of commits represents the history leading up to **X**.

There is quite a difference between a "graph" and a "chart".  Charts present
information visually, while a "graph" is a load of points (vertexes) connected
by links (edges).

In a directed graph, each edge is an arrow which points from one vertex to
another.  Our commit chain is like this - each commit has an arrow pointing to
its parent commit, except for the first commit which (like Batman) has no
parent.

An acyclic graph is a directed graph which has no cycles.  Choose a vertex in a
directed graph.  If by following arrows, you can get back to the same vertex
that you started on, then the graph is cyclic.  Commit chains have no cycles,
so they form acyclic graphs.

Cyclic (cycle: A->B->C->A):

	  --->   ---->
	 /    \ /     \
	A      B-->C-->D
	 \        /
	  <-------

Acyclic:

	A-->B-->C-->D

Also acyclic (note the directions of the arrows):

	  --->   ---->
	 /    \ /     \
	A      B-->C-->D
	 \        /
	  ------->

Your git history is a directed acyclic graph.

A cool thing about DAGs is that they can be "straightened" out such that all
vertexes are located on a straight line and all edges point in the same
direction along the line.  This means that any given commit has a linear chain
of commits preceeding it which fully describe its history.

### Branching

Branching is not a concept unique to Git, however the way that Git implementes
it makes it extremely useful and powerful.

Create a new Git repository (outside the previous one we were using):

	$ mkdir branching
	$ cd branching
	$ git init

Create a file:

	$ echo Hello > file
	$ echo World >> file

Commit it:

	$ git add file
	$ git commit -m 'Initial commit'

Look at which branches we have and which is active:

	$ git branch

	 * master

Now we want to develop a new feature in this repository.  Specifically, we want
to add localisation (l10n).  But we want the development of this feature to be
independent to others that we may also start working on, so we create a branch
for it using `git branch <branch-name> [<start>]`:

	$ git branch l10n

This creates the branch, starting from the HEAD commit since we didn't specify
a commit name or branch name as the `start` parameter.  It does NOT switch us
to the branch.  To see which branch we're on, use:

	$ git branch

	   l10n
	 * master

Switch to the new branch we created:

	$ git checkout l10n

A shortcut for creating a new branch then switching to it is:

	$ git checkout -b l10n

	fatal: A branch named 'l10n' already exists.

This command fails since we had already created the branch.

Let's add out localisation - replace the last line of `file` with `Estonia`:

Contents of `file`:

	Hello
	Estonia

Commit:

	$ git add file
	$ git commit -m 'Localised for Estonia'

Take a look at the commit history:

	$ git log --graph --format=oneline --decorate

	 * 2201... (HEAD l10n) Localised for Estonia
	 * 8a7b... (master, greeting) Initial commit

We haven't finished testing this feature, when someone tells us that "Hello"
should be "Hi".  Let's create a separate branch for this bugfix, and start it
from the `master` branch:

	$ git checkout -b greeting master

We could also specify a commit ID in place of `master`.  If we omitted that
parameter entirely, the new branch would be based on our HEAD, which was pointed
at the `l10n` branch before the previous command, and is now pointed at the
`greeting` branch.

Check which branch we're on:

	$ git branch

	 * greeting
	   l10n
	   master

Ensure that we are basing our new branch on `master`:

Contents of `file`:

	Hello
	World

The `greeting` branch and the `master` branch point at the same commit
currently, but when we add a commit to `greeting`, then that branch will point
to the new commit.  Because HEAD points at `greeting`, it will now automatically
refer to our new commit.

So let's make our commit to `greeting`: edit `file` and change "Hello" to "Hi":

Contents of `file`:

	Hi
	World

Then commit:

	$ git add file
	$ git commit -m 'Greeting fixed'

Now that's done, let's merge it back into `master` by switching to `master` then
using `git merge <commit>`

	$ git checkout master

	$ git branch

	   greeting
	   l10n
	 * master

	$ git merge greeting

	Updating [hash]..[hash]
	Fast-forward
	 file | 2 +-
	 1 file changed, 1 insertion(+), 1 deletion(-)

Because there were no conflicts between `master` and `greeting`, Git could
simply re-play `greeting`'s changes onto `master` to create a merge commit.
However since `greeting` started from the last commit in `master`, Git realised
it could just stick `greeting`'s commits directly on top of `master` - the
resulting history (chain of commits) is identical, so the checksums will remain
the same.

Great.  Let's get back to working on `l10n`:

	$ git checkout l10n

Take a look at the git log:

	$ git log --graph --format=oneline --decorate

	 * 2201... (HEAD l10n) Localised for Estonia
	 * 8a7b... Initial commit

There's no mention of `greeting` or our merge.  Damn...  Checking
`git log --help`, we see that `git log` shows the history of the current branch
only.  It shows us a chain, created by following arrows in the commit graph. But
what if we want to see the whole graph with all branches?  The manpage says
`--all` will do that:

	$ git log --graph --format=oneline --decorate --all

	 * 013dc6dc63189c217c0471e28a13ff60158738a2 (master, greeting) Greeting fixed
	 | * 2201fbefb5e40279c4065ed14fc686f8d4916523 (HEAD, l10n) Localised for Estonia
	 |/
	 * 8a7bf67ff2f679af3cacfd361fa4116150a74290 Initial commit

Since `master` and `greeting` both have the exact same histories, Git shows them
in the same label rather than drawing a separate branch for `greeting`.

### Merge conflicts

Now let's merge our localisation branch into `master`.

	$ git checkout master

	$ git merge l10n

	Auto-merging file
	CONFLICT (content): Merge conflict in file
	Automatic merge failed; fix conflicts and then commit the result

	$ git status

	On branch master
	You have unmerged paths.
	  (fix conflicts and run "git commit")

	Unmerged paths:
	  both modified: file

Let's open `file` in our editor:

Contents of `file`:

	<<<<<<< HEAD
	Hi
	World
	=======
	Hello
	Estonia
	>>>>>>> l10n

Kind of ugly...  Git takes each conflict and wraps it in arrows to show where
each conflicting part came from, with a horizontal rule between each part.
We could resolve this here by deleting the arrow/rule lines and deleting the
"World"/"Hello" lines.

Instead, use a merge tool.  Running `git mergetool` will attempt to auto-detect
which merge tool you have installed, and use it.

	$ git mergetool

If you are familiar with Vim, then Vimdiff is a great mergetool.  Otherwise,
consider a simpler tool (or taking a year to learn Vim ;) ).

After sorting out our conflict, commit the changes:

	$ git commit

	[master d9cfe4e] Merge branch 'l10n'

Now check the git log:

	$ git log --graph --format=oneline --decorate --all

	 *   d9cf4e4246c623cf7469ae6225699a70aeecd063 (HEAD, master) Merge branch 'l10n'
	 |\
	 | * 2201fbefb5e40279c4065ed14fc686f8d4916523 (l10n) Localised for Estonia
	 * | 013dc6dc63189c217c0471e28a13ff60158738a2 (greeting) Greeting fixed
	 |/
	 * 8a7bf67ff2f679af3cacfd361fa4116150a74290 Initial commit

Great.  But maybe we want to experiment with some other idea:

	$ git checkout 8a7b

	Not: checkout out '8a7b'.

	...

We are no longer on a branch, we are in 'detached HEAD' state, where HEAD points
directly to a commit.  Let's create a branch for our new idea:

	$ git checkout -b eesti-keel

	Switched to a new branch 'eesti-keel'

Modify `file`:

	Tere
	Eesti

Stage and commit:

	$ git add file

	$ git commit -m 'Use Estonian'

Check the history:

	$ git log --graph --format=oneline --decorate --all

	 * ec5ab6f43f1f8ac9253dcf26616e4565cc55ec3b (HEAD, eesti-keel) Use Estonian
	 | *   d9cf4e4246c623cf7469ae6225699a70aeecd063 (master) Merge branch 'l10n'
	 | |\
	 | | * 2201fbefb5e40279c4065ed14fc686f8d4916523 (l10n) Localised for Estonia
	 | |/
	 |/|
	 | * 013dc6dc63189c217c0471e28a13ff60158738a2 (greeting) Greeting fixed
	 |/
	 * 8a7bf67ff2f679af3cacfd361fa4116150a74290 Initial commit

### Rewinding (undoing commits)

Things are getting complex... if we decided to keep this change, we could
simply merge it into master:

	$ git checkout master

	$ git merge eesti-keel

	[merge conflict warnings]

	$ git mergetool

	[resolve conflict in mergetool, take eesti-keel completely]

	$ git commit

	$ git log --graph --format=oneline --decorate --all

	 *   1cdf436      (HEAD, master) Merge branch 'eesti-keel'
	 |\
	 | * ec5ab6f      (eesti-keel) Use Estonian
	 * |   d9cf4e4    Merge branch 'l10n'
	 |\ \
	 | * | 2201fbe    (l10n) Localised for Estonia
	 | |/
	 * | 013dc6d      (greeting) Greeting fixed
	 |/
	 * 8a7bf67        Initial commit

The history is rather messy.  Really, we don't care about `greeting` or `l10n`
any more, we just want the changes from `eesti-keel`.

Let's move `master` back one commit, to where it was before our merge:

	$ git reset HEAD~1

	Unstaged changes after reset:
	M file

HEAD~1 means one commit behind HEAD.  HEAD~2 would be two commits behind HEAD.

And reset the working tree:

	$ git checkout ./

Instead of merging `eesti-keel` on top of our other merges, we really want to
get rid of them and just use `eesti-keel` instead.  We could do
`git reset HEAD~2` to undo the two merge commits, then merge `eesti-keel` after.

	$ git reset HEAD~2

	$ git checkout ./

	$ git log --graph --format=oneline --decorate --all

	 * ec5ab6f43f1f8ac9253dcf26616e4565cc55ec3b (eesti-keel) Use Estonian
	 | * 013dc6dc63189c217c0471e28a13ff60158738a2 (greeting) Greeting fixed
	 |/
	 | * 2201fbefb5e40279c4065ed14fc686f8d4916523 (l10n) Localised for Estonia
	 |/
	 * 8a7bf67ff2f679af3cacfd361fa4116150a74290 (HEAD, master) Initial commit

	$ git merge eesti-keel

	$ git log --graph --format=oneline --decorate --all

	 * ec5ab6f43f1f8ac9253dcf26616e4565cc55ec3b (HEAD, master, eesti-keel) Use Estonian
	 | * 013dc6dc63189c217c0471e28a13ff60158738a2 (greeting) Greeting fixed
	 |/
	 | * 2201fbefb5e40279c4065ed14fc686f8d4916523 (l10n) Localised for Estonia
	 |/
	 * 8a7bf67ff2f679af3cacfd361fa4116150a74290 Initial commit

There - Git can just do a fast-forward now, since `eesti-keel` started from the
tip of `master`.  No conflicts and no merge commit needed.

### Editing history and stamping on butterflies (rebase)

I strongly recommend reading the manpage for `git rebase`.  Rebase is a very
useful and powerful tool which, if used incorrectly, can cause lots of problems
that are not always easy to fix.  The manpage has lots of nice graph diagrams to
explain what various rebase operations do.

	$ git rebase --help

Another method is `rebase`.  This allows us to insert and remove commits into
the current branch's history, in addition to squashing several consecutive
commits into one.  Remember that any changes to history will alter the checksums
of commits, so you will have issues trying to push your new history to any other
repositories (e.g. a team's central repository).

First, let's reset `master` back to the mess we had after three merges, by
"resetting" master to the commit that we had at the final merge:

	$ git reset --hard 1cdf4

What's the `--hard`?  I'm not going to tell you.  It can be extremely
destructive if not used carefully, so check the manual before you ever consider
using it yourself.

The most common use for rebase is to pull a chain of commits off its parent, and
moved it onto a new parent.  See the manpage for more info.  We are going to
move the `eesti-keel` commit onto the initial commit.

	$ git rebase --onto 013d 1cdf master

This modifies the history of branch `master`, moving 1cdf (our `eesti-keel`
merge) onto the place where 013d was.  Note that the ID of the `eesti-keel`
merge will have changed after this operation, since it has a new parent chain.

Verify:

	$ git log --graph --format=oneline --decorate --all

	 * ec5ab6f43f1f8ac9253dcf26616e4565cc55ec3b (eesti-keel) Use Estonian
	 | * 013dc6dc63189c217c0471e28a13ff60158738a2 (HEAD, master, greeting) Greeting fixed
	 |/
	 | * 2201fbefb5e40279c4065ed14fc686f8d4916523 (l10n) Localised for Estonia
	 |/
	 * 8a7bf67ff2f679af3cacfd361fa4116150a74290 Initial commit

Great!  But now we have two old branches that aren't wanted any more...

### Deleting branches

TODO: deleting local branches

# Beware of...

Reset `--hard`

Rebase

Anything involving "--force" or "-f"

# Useful aliases

# Status

Short way to display git status

	alias gs='git status'

	$ gs

## Graph

Display entire history of all branches as a graph, with shortened commit IDs

	alias gg='git log --graph --all --oneline --decorate --full-history --color --pretty=format:"%x1b[31m%h%x09%x1b[32m%d%x1b[0m%x20%s"'

	$ gg

## Diff

	alias gd='git diff'

	$ gd

	$ gd <file>

	$ gd <commit> -- <file>

	$ gd <commit-A> <commit B>

	$ gd <commit-A> <commit B> -- <file>

# TODO

Add some graph diagrams

Bare repositories, remotes, fetch/pull, tags+GPG, github, npm, cherry-pick, sobmodules...

# Cheatsheet

## Handle files beginning with hyphen

Put double-hyphen before list of filename(s) / path(s):

	# Create file with annoying name
	$ echo Annoying > --annoying

	# Stage file
	$ git add -- --annoying

	# Unstage file
	$ git reset -- --annoying

	# Delete file (POSIX)
	$ rm -- --annoying

## Staging changes:

New file / modified file:

	$ git add <path>

Delete file / deleted file:

	$ git rm <path>

Move file:

	$ git mv <source> <dest>

## Unstaging / undoing changes:

Undo a `git add`:

	$ git reset <path>

Revert deleted/modified file to version in staging area or in HEAD:

	$ git checkout <path>

Undo a `git rm`:

	$ git reset <path>
	$ git checkout <path>

Unstage changes/deletion to file and revert it to version in HEAD:

	$ git reset --hard <path>

_WARNING_: The following clears the staging area and reverts the entire working
tree to the same state as HEAD.  It will _DESTROY_ any un-committed changes:

	$ git reset --hard

## Viewing changes

Simple, shows which changes are staged and which are not:

	$ git status

Detailed, show changes which are not staged (diff working tree vs. index):

	$ git diff

Working tree or staged changes, vs. some other commit:

	$ git diff [--staged] <commit>

Changes between two commits (optionally, just changes within one path/file):

	$ git diff <commit-A> <commit-B> [<path>]

Alternatively (ommitting either commit will implicitly use HEAD):

	$ git diff <commit-A>..<commit-B>

## Committing changes

Simply:

	$ git commit

To specify the commit message:

	$ git commit -m 'message'

To add currently staged changes to previous commit (HEAD):

	$ git commit --amend

Note that this will alter the checksum of the commit, so do not do this to any
commit that has already been merged or pushed.

## Branching

Switch to branch:

	$ git checkout <branch-name>

Create branch (does not switch to it):

	$ git branch <branch-name>

Create branch and switch to it:

	$ git checkout -b <branch-name>

Create a branch starting at commit or branch `start` and switch to it:

	$ git checkout -b <branch-name> <start>

Merge branch `feature` into branch `master`:

	# Switch to master if we aren't already on it
	$ git checkout master

	# Merge feature into current branch (master in this case)
	$ git merge feature

Delete a branch only if it has been merged:

	$ git branch -d <branch-name>

Delete a branch even if it has not been merged:

	$ git branch -D <branch-name>

## View history

You should probably alias some of these commands into your `.bashrc` rather than
typing them out manually every time.  I only use the last one, which I have
aliased as `gg` ("git graph").

Detailed log of current branch:

	$ git log

Less detailed log of current branch:

	$ git log --format=oneline

Like above, but show commits from all branches (`--all`):

	$ git log --format=oneline --all

Like above, but show branch/pointer/tag names (`--decorate`):

	$ git log --format=oneline --all --decorate

Like above, but show history graph (`--graph`):

	$ git log --graph --all --oneline --decorate

Show full graphical history in colour, including all branches, and with
abbreviated hashes:

	$ git log --graph --all --oneline --decorate --full-history --color --pretty=format:"%x1b[31m%h%x09%x1b[32m%d%x1b[0m%x20%s"

## Rewriting history (rebasing / amending)

Do not do this...  you will probably lose stuff or have trouble checking in.

Read the manpages first:

	$ git commit --help

	$ git rebase --help

	$ git cherry-pick --help

### Amending commits

Add currently staged changes to commit HEAD:

	$ git commit --amend

### Rebasing a branch

Assume we branched `feature` from `master`, and other people have since merged
new features/fixes into `master`:

	master:  A--->B--->C--->D
	               \
	feature:        X--->Y

We want to ensure that our feature will work with these new changes, so we need
to incorporate the new commits to `master` into our `feature` branch.  We could
use `git merge`:

	master:  A--->B-------->C--->D
	               \         \    \
	feature:        X--->Y--->C'-->D'

This will make the history messy though, and creates a new commit in `feature`
for each new commit in `master.  When we merge `feature` back into `master`,
then things will get **really** messy, and we may get a load of merge conflicts
too.

	master:  A--->B-------->C--->D---------E
	               \         \    \       /
	feature:        X--->Y--->C'-->D'--->Z

Instead, we can use `git rebase` to move `feature`, so that it starts from the
tip of `master`:

	# Assuming we are on "feature" (use "git branch" to check)
	$ git rebase master

	# If we aren't not on "feature" - this will checkout feature before rebasing
	$ git rebase master feature

This gives us:

	master:  A--->B--->C--->D
	                         \
	feature:                  X'-->Y'

Note: Because the history behind commits X and Y have changed, their hashes are
now different.

We may get merge failures when we rebase, if git detects conflicts.  We can
either resolve them then run `git rebase --continue`, or ignore a failure by
calling `git rebase --skip`.  To abort a failed rebase, call `git rebase --abort`.

### Moving the children of one commit onto another commit

Cut the children of branch/commit `Y` off their parent `X` and move them into
the position currently occupied by commit/branch `A`:

	$ git rebase --onto=<commit A> <commit Y> [<branch-name>]

Before:

	A--->B--->C--->D--->E

Command:

	$ git rebase --onto=<commit A> <commit C>

After:

	A--->D--->E

Note that this only affects the current branch, see the manpage for `git rebase`
for more information, and for how to solve the problems that arise due to child
branches of the rebased one.

## Configuring remotes

In order to synchronise your repository with others, it is necessary to configure
remotes.  If you used `git clone` to get your repository, then the URL which you
cloned from will already be configured as a remote with the name you specified
(or "origin" if no name was specified).

The actual name that you give a remote is only used locally - so call it whatever
you want.

### Add a remote

	$ git remote add <name> <URL>

### Removing a remote

	$ git remote rm <name>

### Renaming a remote

	$ git remote rename <old-name> <new-name>

## Receiving

### Fetch

Typically, you will never need to use:

	# Defaults to "origin" if no `remote-name` is specified.
	$ git fetch [<remote-name>]

This downloads commits from the remote, but does not update your local history
or HEAD or your working tree.  To merge, use either of:

	$ git merge <remote-name>/<branch-name>

	$ git merge FETCH_HEAD

But don't use the above fetch/merge process at all without good reason, you will
typically want to use `pull` instead.

### Pull

To download commits from a remote and also to update the working tree, history,
and HEAD; use `git pull`:

	$ git pull [<remote-name>] [<branch-name>]

Typically, you want to get the latest version of `master` branch from remote
`origin` so that you can merge your local branches into it:

	$ git pull origin master

This will cause any new commit to `master` in the remote to be applied to your
local `master`, synchronising their histories.  If you have commits in `master`
locally which are not in the remote, then a merge will take place.  If there are
merge conflicts, then you will be notified and asked to resolve them.

To cancel a failed (conflicting) merge:

	$ git reset --merge

To keep things simple, you can tell Git to only merge the new commits in if this
can be done via "fast-forward", i.e. simply adding them onto the tip of the
local branch:

	$ git pull origin master --ff-only

This will fail if you have local commits on `master` which origin does not have
on its version of `master`.  You can then review these commits in `git log` to
see whether a

`git pull` actually runs `git fetch` to get the new commits from the remote,
followed by `git merge` to merge them into the local branch.

### Pull with rebase

An alternative to merging if there are new commits in both the remote and the
local, is to rebase the local commits onto the tip of the remote branch, so that
the remote's new commits appear behind your new local commits.  To achieve this,
use the `--rebase` option:

	$ git pull --rebase [<remote-name>] [<branch-name>]

If the rebase completes without any conflicts, then you will have a linear
history for these new local and remote commits rather than `master` splitting
into two branches then merging again afterwards.

## Sending

To update a remote branch with new commits from your local one, use:

	$ git push [<remote-name>] [<branch-name>]

For example:

	$ git push origin master

If the remote has new commits which are not in your local branch, the push will
be rejected.  Never use the `-f` or `--force` option as this will delete the new
commits from the remote.  Instead, either use `git pull` and resolve the merge
conflict, or use `git pull --rebase` to insert the new remote commits before
your new local commits.

## Rescue lost commits (e.g. lost with rebase / reset / "branch -D")

Do you have the commit ID available?  If not, use the following to find it:

	$ git reflog

	$ git fsck --lost-found

Now checkout the commit:

	$ git checkout <commit>

Check your working tree to ensure that this is indeed the commit that you want
to rescue.

As the commit is at the top of a branch (or indeed on any branch), HEAD no
longer points to a branch.  Thus you will get a warning about "detached HEAD".

Create a branch from this commit:

	$ git branch <branch-name> HEAD

Note that you can skip the `checkout` if you are certain of the commit ID and
just use this instead:

	$ git branch <branch-name> <commit>

Your commit is now visible again in the history (check the git log graph to be
sure).

Commits that are removed from history will be periodically deleted by Git, so
rescue them sooner than later if you don't want them to be deleted.

One can force the deletion of these "dangling" commits with `git gc`, however
there is almost never any reason to manually call this, so I would not advise
it unless you are on a small embedded system and want to free up space.
